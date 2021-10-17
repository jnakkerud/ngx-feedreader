import { HostListener, Injectable } from '@angular/core';
import { FeedStorageService } from '../feed-service/feed-storage.service';

@Injectable({providedIn: 'root'})
export class EvictionService {

    constructor(feedStorage: FeedStorageService) { }
    
    /*@HostListener('window:beforeunload', ['$event'])
    public async run($event: any) {
        alert('done evictin')
        $event.preventDefault();
        $event.returnValue = 'Done evicting.';
    }*/

    public async run() {
        console.log('run eviction')
    }

}