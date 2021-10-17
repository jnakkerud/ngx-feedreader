import { Component, OnDestroy } from '@angular/core';
import { EvictionService } from 'src/app/core/eviction-service/eviction.service';
import { FeedStoreItem } from 'src/app/core/feed-service/feed-storage.service';
import { FeedService } from 'src/app/core/feed-service/feed.service';
import { Channel } from 'src/app/core/topic-service/topic.service';
@Component({
    selector: 'app-channel-detail',
    templateUrl: 'channel-detail.component.html',
    styleUrls: ['./channel-detail.component.scss'],    
})
export class ChannelDetailComponent implements OnDestroy{

    feedItems?: FeedStoreItem[]; 

    constructor(private feedService: FeedService, private evictionService: EvictionService) {}

    ngOnDestroy(): void {
        this.evictionService.run();
    }

    onSelectionChange(channel: Channel) {
        this.loadFeed(channel);
    }

    loadFeed(channel: Channel) {
        this.feedService.loadFeeds([channel]).then(data => {
            this.feedItems = data;
        });
    }
    
    markAllRead(): void {
        // TODO mark all as read and remove
    }
}