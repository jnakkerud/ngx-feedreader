import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { Component, HostListener, Injectable, NgModule } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { map, mergeAll, mergeMap, toArray } from 'rxjs/operators';
import { FeedService } from '../core/feed-service/feed.service';
import { TopicService } from '../core/topic-service/topic.service';
import { MaterialModule } from '../material.module';
import { TopicRoutingModule } from '../topic/topic-routing.module';
interface TopicNode {
    name: string;
    xmlUrl?: string;
    channels?: TopicNode[];
}
interface TopicFlatNode {
    expandable: boolean;
    name: string;
    level: number;
    url: string;
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

    getNode(name: string): TopicNode | undefined {
        return this.data.find(n => n.name === name);
    }

    insertItem(parent: TopicNode, name: string): void {
        if (parent.channels) {
            const newNode = { name: name } as TopicNode;
            parent.channels?.push(newNode);
            this.dataChange.next(this.data);
        }
    }

    updateItem(node: TopicNode, name: string) {
        // TODO update the url then call the url to get the name from the channel
        node.name = name;
        //this.dataChange.next(this.data);

        // TODO save topics

        console.log('updateItem', node)
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

    dataSource: MatTreeFlatDataSource<TopicRoutingModule, TopicFlatNode>;

    checklistSelection = new SelectionModel<TopicFlatNode>(true);

    editingNodeMap = new Map<TopicFlatNode, TopicNode>();

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
        const flatNode =  {
            expandable: !!node.channels && node.channels.length > 0,
            name: node.name,
            level: level,
            url: node.xmlUrl ?? 'None'
        } as TopicFlatNode;
        if (flatNode.name === '') {
            this.editingNodeMap.set(flatNode, node);
        }
        return flatNode;
    }

    onFileSelected(event: any) {
        this.topicDataSource.loadFromFile(event.target.files[0]);
    }

    toggleEditor() {
        this.showEditor = !this.showEditor;
    }

    saveTopic(topic: string) {
        // TODO
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

    /** Select the category so we can insert the new item. */
    addNewItem(node: TopicFlatNode) {
        const parentNode = this.topicDataSource.getNode(node.name);
        this.topicDataSource.insertItem(parentNode!, '');
        this.treeControl.expand(node);
    }

    saveNode(node: TopicFlatNode, itemValue: string) {
        console.log('saveNode', node);

        const updateNode = this.editingNodeMap.get(node);
        if (updateNode) {
            this.topicDataSource.updateItem(updateNode, itemValue);
        }
        
        //const nestedNode = this.flatNodeMap.get(node);
        //this._database.updateItem(nestedNode!, itemValue);

        // remove from editing node map
    }

}

@NgModule({
    imports: [
        CommonModule, MaterialModule, RouterModule],
    exports: [ConfigComponent],
    declarations: [ConfigComponent],
  })
export class ConfigModule {}