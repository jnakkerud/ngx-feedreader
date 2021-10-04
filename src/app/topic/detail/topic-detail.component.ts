import { Component } from '@angular/core';
import { FeedStoreItem } from 'src/app/core/feed-service/feed-storage.service';
import { FeedService } from 'src/app/core/feed-service/feed.service';
import { Channel } from 'src/app/core/topic-service/topic.service';
@Component({
    selector: 'app-topic-detail',
    templateUrl: 'topic-detail.component.html',
    styleUrls: ['./topic-detail.component.scss'],    
})
export class TopicDetailComponent {

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

    filterOnChannel(feedItem: FeedStoreItem) {
        console.log('filterOnChannel', feedItem.channelName);
    }

    updateSaved(feedItem: FeedStoreItem, saved: boolean): void {
        feedItem.saved = saved;
        this.feedService.updateFeed(feedItem).then(i => {
            console.log('updateSaved', i);
        })
    }

    // TODO handle read for later feeds
    onOpenFeedItem(feedItem: FeedStoreItem) {
        feedItem.markedAsRead = true;
        this.feedService.updateFeed(feedItem).then(i => {
            console.log('onOpenFeedItem.updated', i);
        })
    }

    markAllRead(): void {
        // TODO mark all as read
    }
}