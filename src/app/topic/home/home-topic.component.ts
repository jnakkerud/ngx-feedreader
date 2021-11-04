import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopicService } from 'src/app/core/topic-service/topic.service';

@Component({
    selector: 'app-home-topic',
    template: ``
})
export class HomeTopicComponent implements OnInit {

    constructor(private router: Router, private topicService: TopicService) { }

    ngOnInit() { 
        if (this.topicService.hasTopics()) {
            // redirect to the first topic
            this.topicService.getTopics().then(topics => {
                const firstTopic = topics[0].name;
                this.router.navigate([`/topic/${firstTopic}`]);
            });            
        }
    }
}