import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Channel } from '../topic-service/topic.service';
import { FeedReader } from './feed-reader';

export interface FeedItem {
    title: string;
    description: string;
    link: string;
    pubDate?: Date;
}

export interface Feed {
    title: string;
    link: string;
    description?: string;
    image?: string;
    items: FeedItem[];
}

// https://blog.grida.co/cors-anywhere-for-everyone-free-reliable-cors-proxy-service-73507192714e
const CORS_PROXY = 'https://cors.bridged.cc'; // TODO make a config item
@Injectable({providedIn: 'root'})
export class FeedService {

    private feedReader = new FeedReader();

    constructor(private httpClient: HttpClient) { }
    
    public load(channel: Channel): Promise<Feed> {
        return new Promise<Feed>(resolve => {
            this.httpClient.get(`${CORS_PROXY}/${channel.xmlUrl}`, { responseType: 'text' })
                .subscribe(response => {
                    resolve(this.feedReader.read(response));            
                },
                error => {
                    console.log(error);
                    //resolve(null);
                }
            );
        });
    }
}