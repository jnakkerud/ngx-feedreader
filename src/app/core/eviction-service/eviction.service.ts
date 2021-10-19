import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { FeedStorageService, FeedStoreItem } from '../feed-service/feed-storage.service';

@Injectable({providedIn: 'root'})
export class EvictionService {

    constructor(private feedStorage: FeedStorageService) { 
        fromEvent(window, 'beforeunload')
        .subscribe(() => this.evict());        
    }
    
    public async markAndEvict(feedItems: FeedStoreItem[] | undefined) {
        if (feedItems) {
            let markedItems: FeedStoreItem[] = await this.feedStorage.bulkUpdate(feedItems.map(item => {
                item.markedAsRead = true;
                return item;
            }));
            this.evict();
        }
    }

    public evict() {
        this.feedStorage.delete().then(() => console.log('Delete done'));
    }
}