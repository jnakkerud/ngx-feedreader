import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { FeedStorageService, FeedStoreItem } from '../feed-service/feed-storage.service';

// 15 days in milliseconds
const DAYS15_TO_MILLISECONDS = 1296000000;

@Injectable({providedIn: 'root'})
export class EvictionService {

    constructor(private feedStorage: FeedStorageService) { 
        fromEvent(window, 'beforeunload')
        .subscribe(() => this.evict());        
    }
    
    public async markAndEvict(feedItems: FeedStoreItem[] | undefined) {
        if (feedItems) {
            console.log('marking to evict', feedItems);
            await this.feedStorage.bulkUpdate(feedItems.map(item => {
                item.markedAsRead = true;
                return item;
            }));
        }
        this.evict();
    }

    public evict() {
        const evictDate = new Date(new Date().getTime() - DAYS15_TO_MILLISECONDS);
        this.feedStorage.delete(IDBKeyRange.upperBound(evictDate)).then(() => console.log('Delete done'));
    }
}