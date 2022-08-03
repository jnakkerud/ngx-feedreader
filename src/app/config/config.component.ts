import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { Component, HostListener, Injectable, NgModule } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { map, mergeAll, mergeMap, toArray } from 'rxjs/operators';
import { FeedService } from '../core/feed-service/feed.service';
import { FeedType, Topic, TopicService } from '../core/topic-service/topic.service';
import { MaterialModule } from '../material.module';
import { HeaderModule } from '../header/header.component';
interface TopicNode {
    name: string;
    xmlUrl?: string;
    channels?: TopicNode[];
}
export class TopicFlatNode {
    expandable = false;
    name = '';
    level = 0;
    url = '';
}

type TopicNodeEx = TopicNode & {
    type?: FeedType;
}

function isValid(file: File): boolean {
    const validTypes = ['text/xml', 'application/xml', 'text', ''];
    if (validTypes.indexOf(file.type) === -1) {
        alert('Invalid File Type');
        return false;
    }
    return true;
}

@Injectable()
export class TopicDataSource {
    dataChange = new BehaviorSubject<TopicNode[]>([]);

    get data(): TopicNode[] {
        return this.dataChange.value;
    }

    constructor(private topicService: TopicService, private feedService: FeedService) {
        this.initialize();
    }

    initialize() {
        if (this.topicService.hasTopics()) {
            this.topicService.getTopics().then(topics => {
                this.dataChange.next(topics);
            });
        }
    }

    async loadFromFile(file: File) {
        if (isValid(file)) {

            const text = await file.text();
            const topics = this.topicService.loadTopics(text);

            if (topics) {
                this.dataChange.next(topics);
                this.topicService.saveTopics(topics);
                this.syncChannels();
            }
        }
    }

    syncChannels(): void {
        // flatten topics to channel name only
        from(this.topicService.getTopics()).pipe(
            mergeAll(),
            mergeMap(val => from(val.channels ?? [])),
            map(channel => {return channel.name}),
            toArray()
        ).subscribe(result => this.feedService.syncFeeds(result));
    }

    insertChannel(parent: TopicNode, name: string): void {
        if (parent.channels) {
            const newNode = { name: name } as TopicNodeEx;
            parent.channels?.push(newNode);
            this.dataChange.next(this.data);
        }
    }

    // https://hackernoon.com/feed
    // Atom: https://www.theverge.com/rss/frontpage
    updateChannel(node: TopicNodeEx, url: string): Promise<TopicNode> {
        return new Promise<TopicNode>(resolve =>{
            node.xmlUrl = url;
            // get and parse the feed from the url.  Note that we do not have the name 
            // or the feed type: (rss or atom).  So rely on the feed service to get this info
            this.feedService.getFeed(
                {
                    xmlUrl: url,
                    name: '',
                }
            ).then(f => {
                node.name = f.title;
                node.type = f.type;
                resolve(node);
                this.topicService.saveTopics(this.data as Topic[]);
                this.dataChange.next(this.data);                
            });
    
        });
    }

    insertTopic(name: string): void {
        const newTopic: TopicNode = {
            name: name,
            channels: []
        } 
        newTopic.channels?.push({name: ''});

        this.data.push(newTopic);
        this.topicService.saveTopics(this.data as Topic[]);
        this.dataChange.next(this.data);
    }

    delete(nodes: Map<TopicNode, TopicNode | null>): void {
        console.log('deleteNodes', nodes)

        nodes.forEach((parent, node) => {
            this.deleteNode(node, parent);
        });

        this.topicService.saveTopics(this.data as Topic[]);
        this.dataChange.next(this.data);                
    }

    deleteNode(node: TopicNode, parent: TopicNode | null) {
        if (parent && parent.channels) {
            const idx = parent.channels.indexOf(node);
            if (idx !== -1) {
                parent.channels.splice(idx, 1);
            }

        } else {
            const idx = this.data.indexOf(node);
            if (idx !== -1) {
                this.data.splice(idx, 1);
            }
        }
    }
}

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss'],
    providers: [TopicDataSource],
})
export class ConfigComponent {

    dropMessage = 'Drop OPML file here';
    dragging = false;

    showEditor = false;
    
    treeControl: FlatTreeControl<TopicFlatNode>;

    treeFlattener: MatTreeFlattener<TopicNode, TopicFlatNode>;

    dataSource: MatTreeFlatDataSource<TopicNode, TopicFlatNode>;

    checklistSelection = new SelectionModel<TopicFlatNode>(true);

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<TopicFlatNode, TopicNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<TopicNode, TopicFlatNode>();

    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt: any) {
        evt.preventDefault();
        evt.stopPropagation();
        this.dragging = true;
    }

    // Dragleave listener
    @HostListener('dragleave', ['$event']) onDragLeave(evt: any) {
        evt.preventDefault();
        evt.stopPropagation();
        this.dragging = false;
    }

    // Drop listener
    @HostListener('drop', ['$event']) ondrop(evt: any) {
        evt.preventDefault();
        evt.stopPropagation();
        this.dragging = false;

        const files = evt.dataTransfer.files;
        if (files.length > 0) {
            this.topicDataSource.loadFromFile(files[0]);
        }
    }

    constructor(private topicDataSource: TopicDataSource) { 
        this.treeFlattener = new MatTreeFlattener(
            this.nodeTransformer, 
            this.getLevel, 
            this.isExpandable, 
            this.getChildren);

        this.treeControl = new FlatTreeControl<TopicFlatNode>(this.getLevel, this.isExpandable);
    
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        
        this.topicDataSource.dataChange.subscribe(data => {
            this.dataSource.data = data;
        });
    }

    hasChild = (_: number, node: TopicFlatNode) => node.expandable;

    getChildren = (node: TopicNode): TopicNode[] => node.channels ?? [];

    getLevel = (node: TopicFlatNode) => node.level;

    isExpandable = (node: TopicFlatNode) => node.expandable;

    hasNoContent = (_: number, _nodeData: TopicFlatNode) => _nodeData.name === '';

    nodeTransformer = (node: TopicNode, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode =
          existingNode && existingNode.name === node.name ? existingNode : new TopicFlatNode();
        flatNode.name = node.name;
        flatNode.level = level;
        flatNode.expandable = !!node.channels?.length;
        flatNode.url = node.xmlUrl ?? 'None'
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;        
    }

    onFileSelected(event: any): void {
        this.topicDataSource.loadFromFile(event.target.files[0]);
    }

    toggleEditor(): void {
        this.showEditor = !this.showEditor;
    }

    saveTopic(topic: string): void {
        this.topicDataSource.insertTopic(topic);
        this.toggleEditor();
    }

    deleteSelection(): void {
        // the result is the node to delete and the parent node
        const selected = new Map<TopicNode, TopicNode | null>();

        // walk the selected nodes in the tree
        this.checklistSelection.selected.forEach(n => {
            // is it the parent
            if (this.getLevel(n) < 1) {
                selected.set(this.flatNodeMap.get(n)!, null);
            } else {
                // if a child has a selected parent
                const parent = this.getParentNode(n);
                if (parent && this.checklistSelection.isSelected(parent)) {
                    selected.set(this.flatNodeMap.get(parent)!, null);
                } else {
                    selected.set(this.flatNodeMap.get(n)!, this.flatNodeMap.get(parent!)!);
                }
            }
        });
        this.topicDataSource.delete(selected);
        this.checklistSelection.clear();
    }

    hasTreeData(): boolean {
        return (this.treeControl.dataNodes && this.treeControl.dataNodes.length > 0);
    }

    treeIsSelected(): boolean {
        return this.checklistSelection.selected.length > 0;
    }

    /** -----  tree node handlers ----  */

    /* Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    leafItemSelectionToggle(node: TopicFlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
    }

    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: TopicFlatNode): void {
        let parent: TopicFlatNode | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /* Get the parent node of a node */
    getParentNode(node: TopicFlatNode): TopicFlatNode | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: TopicFlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected =
            descendants.length > 0 &&
            descendants.every(child => {
                return this.checklistSelection.isSelected(child);
            });
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    }

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: TopicFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected =
            descendants.length > 0 &&
            descendants.every(child => {
                return this.checklistSelection.isSelected(child);
            });
        return descAllSelected;
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: TopicFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    itemSelectionToggle(node: TopicFlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.forEach(child => this.checklistSelection.isSelected(child));
        this.checkAllParentsSelection(node);
    }   

    addNewItem(node: TopicFlatNode) {
        const parentNode = this.flatNodeMap.get(node);
        this.topicDataSource.insertChannel(parentNode!, '');
        this.treeControl.expand(node);
    }

    saveNode(node: TopicFlatNode, itemValue: string) {
        const updateNode = this.flatNodeMap.get(node);
        if (updateNode) {
            this.topicDataSource.updateChannel(updateNode, itemValue).then(result => {
                console.log('saveNode', result);
            });
        }
    }
}

@NgModule({
    imports: [
        CommonModule, MaterialModule, RouterModule, HeaderModule],
    exports: [ConfigComponent],
    declarations: [ConfigComponent],
  })
export class ConfigModule {}