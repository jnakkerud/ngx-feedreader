import { FlatTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { Component, HostListener, NgModule } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { TopicService } from '../core/topic-service/topic.service';
import { MaterialModule } from '../material.module';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
    name: string;
    children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
    {
        name: 'Fruit',
        children: [
            { name: 'Apple' },
            { name: 'Banana' },
            { name: 'Fruit loops' },
        ]
    }, {
        name: 'Vegetables',
        children: [
            {
                name: 'Green',
                children: [
                    { name: 'Broccoli' },
                    { name: 'Brussels sprouts' },
                ]
            }, {
                name: 'Orange',
                children: [
                    { name: 'Pumpkins' },
                    { name: 'Carrots' },
                ]
            },
        ]
    },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
}

function isValid(file: File): boolean {
    const validTypes = ['text/xml', 'application/xml', 'text', ''];
    if (validTypes.indexOf(file.type) === -1) {
        alert('Invalid File Type');
        return false;
    }
    return true;
}
@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss']
})
export class ConfigComponent {

    dropMessage = 'Drop OPML file here';
    filename: string | undefined;
    dragging = false;

    private file: File | null = null;

    private _transformer = (node: FoodNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            level: level,
        };
    }

    treeControl = new FlatTreeControl<ExampleFlatNode>(
        node => node.level, node => node.expandable);

    treeFlattener = new MatTreeFlattener(
        this._transformer, node => node.level, node => node.expandable, node => node.children);

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

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
            this.handleFile(files[0]);
        }
    }

    constructor(private topicService: TopicService) {
        this.dataSource.data = TREE_DATA;
    }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

    onFileSelected(event: any) {
        console.log('event', event)
        this.handleFile(event.target.files[0]);
    }

    async handleFile(file: File) {
        if (isValid(file)) {
            this.file = file;
            this.filename = this.file.name;

            const text = await this.file.text();
            const topics = this.topicService.loadTopics(text);

            if (topics) {
                console.log(topics)
                // TODO
                //this.topicService.saveTopics(topics);
            }
        }
    }

}

@NgModule({
    imports: [
        CommonModule, MaterialModule, RouterModule],
    exports: [ConfigComponent],
    declarations: [ConfigComponent],
  })
export class ConfigModule {}