import { Component, Input } from '@angular/core';
import { FeedStoreItem } from 'src/app/core/feed-service/feed-storage.service';
import { FeedService } from 'src/app/core/feed-service/feed.service';

@Component({
    selector: 'app-feeds',
    templateUrl: 'feeds.component.html',
    styleUrls: ['./feeds.component.scss'],
})
export class FeedsComponent {

    @Input() feedItems?: FeedStoreItem[]; 

    constructor(private feedService: FeedService) {}

    filterOnChannel(feedItem: FeedStoreItem) {
        console.log('filterOnChannel', feedItem.channelName);
    }

    updateSaved(feedItem: FeedStoreItem, saved: boolean): void {
        feedItem.saved = saved;
        this.feedService.updateFeed(feedItem).then(i => {
            console.log('updateSaved', i);
        })
    }

    onOpenFeedItem(feedItem: FeedStoreItem) {
        feedItem.markedAsRead = true;
        this.feedService.updateFeed(feedItem).then(i => {
            console.log('onOpenFeedItem.updated', i);
        })
    }
}