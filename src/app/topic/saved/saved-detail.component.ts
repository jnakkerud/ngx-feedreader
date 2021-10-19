import { Component, OnInit } from '@angular/core';
import { EvictionService } from 'src/app/core/eviction-service/eviction.service';
import { FeedStoreItem } from 'src/app/core/feed-service/feed-storage.service';
import { FeedService } from 'src/app/core/feed-service/feed.service';

@Component({
    selector: 'app-topic-saved',
    templateUrl: 'saved-detail.component.html',
    styleUrls: ['./saved-detail.component.scss']    
})

export class SavedDetailComponent implements OnInit {

    feedItems?: FeedStoreItem[]; 

    constructor(private feedService: FeedService, private evictionService: EvictionService) { }

    ngOnInit() { 
        this.feedService.loadSavedFeeds().then(data => {
            this.feedItems = data;
        });
    }

    markAllRead(): void {
        this.evictionService.markAndEvict(this.feedItems);
        this.feedItems = [];
    }    
}