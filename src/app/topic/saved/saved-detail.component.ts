import { Component, OnInit } from '@angular/core';
import { FeedStoreItem } from 'src/app/core/feed-service/feed-storage.service';
import { FeedService } from 'src/app/core/feed-service/feed.service';

@Component({
    selector: 'app-topic-saved',
    templateUrl: 'saved-detail.component.html',
    styleUrls: ['./saved-detail.component.scss']    
})

export class SavedDetailComponent implements OnInit {

    feedItems?: FeedStoreItem[]; 

    constructor(private feedService: FeedService) { }

    ngOnInit() { 
        this.feedService.loadSavedFeeds().then(data => {
            this.feedItems = data;
        });
    }

    markAllRead(): void {
        // TODO mark all as read
    }    
}