import { Component } from '@angular/core';
import { EvictionService } from 'src/app/core/eviction-service/eviction.service';
import { FeedStoreItem } from 'src/app/core/feed-service/feed-storage.service';
import { FeedService } from 'src/app/core/feed-service/feed.service';
import { Channel } from 'src/app/core/topic-service/topic.service';
@Component({
    selector: 'app-channel-detail',
    templateUrl: 'channel-detail.component.html',
    styleUrls: ['./channel-detail.component.scss'],    
})
export class ChannelDetailComponent {

    feedItems?: FeedStoreItem[]; 

    constructor(private feedService: FeedService, private evictionService: EvictionService) {}

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