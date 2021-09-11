import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Channel } from '../topic-service/topic.service';

// https://blog.grida.co/cors-anywhere-for-everyone-free-reliable-cors-proxy-service-73507192714e
const CORS_PROXY = 'https://cors.bridged.cc';

@Injectable({providedIn: 'root'})
export class ChannelService {
    constructor(private httpClient: HttpClient) { }
    
    public load(channel: Channel) {
        this.httpClient.get(`${CORS_PROXY}/${channel.xmlUrl}`, { responseType: 'text' }).subscribe(result => console.log(result))

        // TODO RssReader ... see https://rss2json.com/#rss_url=https%3A%2F%2Ftechcrunch.com%2Ffeed%2F 
        // Also https://github.com/gurov/stupid-rss-reader
    }
}