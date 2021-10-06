import { Component } from '@angular/core';
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

    constructor(private feedService: FeedService) {}

    onSelectionChange(channel: Channel) {
        this.loadFeed(channel);
    }

    loadFeed(channel: Channel) {
        this.feedService.loadFeeds([channel]).then(data => {
            this.feedItems = data;
        });
    }
    
    markAllRead(): void {
        // TODO mark all as read
    }
}