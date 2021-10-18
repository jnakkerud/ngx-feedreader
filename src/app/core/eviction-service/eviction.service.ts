import { HostListener, Injectable } from '@angular/core';
import { FeedStorageService } from '../feed-service/feed-storage.service';

@Injectable({providedIn: 'root'})
export class EvictionService {

    constructor(private feedStorage: FeedStorageService) { }
    
    /*@HostListener('window:beforeunload', ['$event'])
    public async run($event: any) {
        alert('done evictin')
        $event.preventDefault();
        $event.returnValue = 'Done evicting.';
    }*/

    public run() {
        this.feedStorage.delete().then();
    }

}