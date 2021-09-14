import { Injectable } from '@angular/core';
import { Topic } from './topic.service';

const TOPICS_ID = 'ngx-feedreader-topics';

@Injectable({providedIn: 'root'})
export class TopicStorageService {
 
    public get(): Topic[] {
        const data = localStorage.getItem(TOPICS_ID);
        const topics = (data) ? JSON.parse(data) as [] : [];
        return topics;  
    }

    public put(topics: Topic[]): void {
        localStorage.setItem(TOPICS_ID, JSON.stringify(topics));
    }
}