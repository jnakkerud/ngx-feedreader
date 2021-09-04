import { Injectable } from '@angular/core';

export interface Topic {
    name: string;
    description?: string;
}

const TEST_TOPICS = [
    {
        name: 'Skiing'
    },
    {
        name: 'Development'
    },
    {
        name: 'Housing'
    },
    {
        name: 'Travel'
    }
]

@Injectable({providedIn: 'root'})
export class TopicService {
    constructor() { }
    
    public getTopics(): Topic[] {
        return TEST_TOPICS;
    }

}