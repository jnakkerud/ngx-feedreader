import { Component, Input, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { FeedService } from 'src/app/core/feed-service/feed.service';
import { Channel, Topic, TopicService } from 'src/app/core/topic-service/topic.service';

@Component({
    selector: 'app-topic-detail',
    templateUrl: 'topic-detail.component.html',
    styleUrls: ['./topic-detail.component.scss'],    
})

export class TopicDetailComponent implements OnInit {

    @Input() topic?: Topic;

    constructor(private route: ActivatedRoute, private topicService: TopicService, private feedService: FeedService) { 
        this.route.params.subscribe(p => {
            this.topicService.getTopic(p.topicId).then(val => this.topic = val);
        });        
    }

    ngOnInit() { }

    onSelectionChange(change: MatSelectionListChange) {
        this.loadFeed(change.options[0].value);
    }

    async loadFeed(channel: Channel) {
        let feed = await this.feedService.load(channel);
        console.log(feed);
    }
}