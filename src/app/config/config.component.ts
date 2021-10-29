import { FlatTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { Component, HostListener, NgModule, OnInit } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { TopicService } from '../core/topic-service/topic.service';
import { MaterialModule } from '../material.module';
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

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

    dropMessage = 'Drop OPML file here';
    filename: string | undefined;
    dragging = false;

    private file: File | null = null;

    nodeTransformer = (node: TopicNode, level: number) => {
        return {
            expandable: !!node.channels && node.channels.length > 0,
            name: node.name,
            level: level,
            url: node.xmlUrl ?? 'None'
        };
    }
    
    treeControl = new FlatTreeControl<TopicFlatNode>(
        node => node.level, node => node.expandable);

    treeFlattener = new MatTreeFlattener(
        this.nodeTransformer, node => node.level, node => node.expandable, node => node.channels);

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

    constructor(private topicService: TopicService) { }

    ngOnInit(): void {
        if (this.topicService.hasTopics()) {
            this.topicService.getTopics().then(topics => {
                this.dataSource.data = topics;
            });
        }
    }

    hasChild = (_: number, node: TopicFlatNode) => node.expandable;

    onFileSelected(event: any) {
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
                this.dataSource.data = topics;
                this.topicService.saveTopics(topics);
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