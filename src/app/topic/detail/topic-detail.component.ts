import { Component, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { FeedStoreItem } from 'src/app/core/feed-service/feed-storage.service';
import { FeedService } from 'src/app/core/feed-service/feed.service';
import { Channel, Topic, TopicService } from 'src/app/core/topic-service/topic.service';
@Component({
    selector: 'app-topic-detail',
    templateUrl: 'topic-detail.component.html',
    styleUrls: ['./topic-detail.component.scss'],    
})
export class TopicDetailComponent {

    @Input() topic?: Topic;

    feedItems?: FeedStoreItem[]; 

    constructor(private route: ActivatedRoute, private topicService: TopicService, private feedService: FeedService) { 
        this.route.params.subscribe(p => {
            this.topicService.getTopic(p.topicId).then(val => {
                this.topic = val;
                //this.loadFeeds();
            });
        });        

    }

    onSelectionChange(change: MatSelectChange) {
        this.loadFeed(change.value);
    }

    async loadFeed(channel: Channel) {
        this.feedItems = await this.feedService.loadFeeds([channel]);
    }

    filterOnChannel(feedItem: FeedStoreItem) {
        console.log('filterOnChannel', feedItem.channelName);
    }

    updateSaved(feedItem: FeedStoreItem, saved: boolean): void {
        feedItem.saved = saved;
        this.feedService.updateFeed(feedItem).then(i => {
            console.log('updateSaved', i);
        })
    }
}