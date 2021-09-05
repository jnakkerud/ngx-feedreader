import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Topic } from 'src/app/core/topic-service/topic.service';

@Component({
    selector: 'app-topic-detail',
    templateUrl: 'topic-detail.component.html',
    styleUrls: ['./topic-detail.component.scss'],    
})

export class TopicDetailComponent implements OnInit {

    @Input() topic?: Topic;

    constructor(private route: ActivatedRoute) { 
        // TODO move to topic detail
        this.route.params.subscribe(p => {
            this.topic = {
                name: p.topicId
            }
        });        
    }

    ngOnInit() { }
}