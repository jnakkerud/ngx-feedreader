import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { EvictionService } from 'src/app/core/eviction-service/eviction.service';
import { FeedStoreItem } from 'src/app/core/feed-service/feed-storage.service';
import { FeedService } from 'src/app/core/feed-service/feed.service';
import { Channel, Topic, TopicService } from 'src/app/core/topic-service/topic.service';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-channel-detail',
    templateUrl: 'channel-detail.component.html',
    styleUrls: ['./channel-detail.component.scss'],    
})
export class ChannelDetailComponent implements OnInit {

    topic?: Observable<Topic>;

    feedItems?: FeedStoreItem[]; 

    constructor(
        private route: ActivatedRoute, 
        private feedService: FeedService, 
        private evictionService: EvictionService, 
        private topicService: TopicService) {}

    ngOnInit(): void {
        this.topic = this.route.paramMap.pipe(
            switchMap(params => {
                return this.topicService.getTopic(params.get('topicId')!);
            })
        );        
    }

    onSelectionChange(channel: Channel) {
        this.loadFeed(channel);
    }

    loadFeed(channel: Channel) {
        this.feedItems = undefined;
        this.feedService.loadFeeds([channel]).then(data => {
            this.feedItems = data;
        });
    }
    
    markAllRead(): void {
        this.evictionService.markAndEvict(this.feedItems);
        this.feedItems = [];
    }

    hasFeedItems(): boolean {
        return Array.isArray(this.feedItems) && this.feedItems.length > 0;
    }
}