import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-topic',
    templateUrl: './topic.component.html',
    styleUrls: ['./topic.component.scss']
})
export class TopicComponent {

    topic = '';

    constructor(private route: ActivatedRoute) {
        this.route.params.subscribe(p => {
            this.topic = p.topicId;
        });
    }
}

@NgModule({
    imports: [
        CommonModule],
    exports: [TopicComponent],
    declarations: [TopicComponent],
  })
export class TopicModule {}
