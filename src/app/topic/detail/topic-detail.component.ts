import { Component, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { FeedItem, FeedService } from 'src/app/core/feed-service/feed.service';
import { Channel, Topic, TopicService } from 'src/app/core/topic-service/topic.service';

export interface FeedItemEx extends FeedItem {
    channelName: string;
    saved: boolean;
}

@Component({
    selector: 'app-topic-detail',
    templateUrl: 'topic-detail.component.html',
    styleUrls: ['./topic-detail.component.scss'],    
})

export class TopicDetailComponent {

    @Input() topic?: Topic;

    feedItems?: FeedItemEx[]; 

    constructor(private route: ActivatedRoute, private topicService: TopicService, private feedService: FeedService) { 
        this.route.params.subscribe(p => {
            this.topicService.getTopic(p.topicId).then(val => this.topic = val);
        });        
    }

    onSelectionChange(change: MatSelectChange) {
        this.loadFeed(change.value);
    }

    async loadFeed(channel: Channel) {
        let feed = await this.feedService.load(channel);
        if (feed && feed?.items) {
            let f = {channelName: channel.title, saved: false};
            this.feedItems = feed.items.map(item => {return {...f, ...item} as FeedItemEx});
        }
    }

    filterOnChannel(feedItem: FeedItemEx) {
        console.log('filterOnChannel', feedItem.channelName);
    }
}