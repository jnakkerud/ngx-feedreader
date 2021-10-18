import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Channel } from '../topic-service/topic.service';
import { FeedReader } from './feed-reader';
import { FeedStorageService, FeedStoreItem, FilterBy } from './feed-storage.service';
export interface FeedItem {
    title: string;
    description: string;
    link: string;
    pubDate: Date;
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


const httpOptions: Object = {
    headers: new HttpHeaders({
      'x-cors-grida-api-key': '26abc730-6079-4cea-a3e6-b0665cc0d190'
    }),
    responseType: 'text'
};
@Injectable({providedIn: 'root'})
export class FeedService {

    private feedReader = new FeedReader();

    constructor(private httpClient: HttpClient, private feedStorageService: FeedStorageService) {}
    
    getFeed(channel: Channel): Promise<Feed> {
        return new Promise<Feed>(resolve => {
            this.httpClient.get<string>(`${CORS_PROXY}/${channel.xmlUrl}`, httpOptions)
                .subscribe(response => {
                    let feed = this.feedReader.read(response);
                    feed.title = channel.title;
                    resolve(feed); 
                },
                error => {
                    console.log(error);
                }
            );
        });
    }

    getFeedItems(channels: Channel[]): Promise<FeedStoreItem[]> {
        return new Promise<FeedStoreItem[]>(resolve => {
            const feedSrc = channels.map(c => {
                return this.getFeed(c);
            });
            let items: FeedStoreItem[] = [];
            Promise.all(feedSrc).then(result => {
                result.forEach(feed => {
                    if (feed?.items) {
                        let f = { channelName: feed.title, saved: false, markedAsRead: false};
                        items.push(...feed.items.map(item => { return { ...f, ...item } as FeedStoreItem }));
                    }
                });
                resolve(items);
            });
        });
    }

    // TODO handle multiple channels
    public async loadFeeds(channels: Channel[]): Promise<FeedStoreItem[]> {
        const filterBy: FilterBy[] = [
            {
                filterName: 'channelName',
                value: channels[0].title
            }, 
            {
                filterName: 'markedAsRead',
                value: false

            }
        ]
        let storeItems = await this.feedStorageService.getItems(filterBy, 1);
        const latest = storeItems?.length ? storeItems[0].pubDate : new Date(628021800000); // 1989

        // get feeds via url
        let feedItems = await this.getFeedItems(channels);

        // save the latest feeds
        let newItems = feedItems.filter(i => {
            return i.pubDate.getTime() > latest.getTime();
        });

        if (newItems?.length) {
            await this.feedStorageService.add(newItems);
        }
    
        return this.feedStorageService.getItems(filterBy);
    }

    public async loadSavedFeeds(): Promise<FeedStoreItem[]> {
        const filterBy: FilterBy[] = [
            {
                filterName: 'saved',
                value: true
            }, 
            {
                filterName: 'markedAsRead',
                value: false

            }
        ]    
        return this.feedStorageService.getItems(filterBy);
    }


    public updateFeed(feedItem: FeedStoreItem): Promise<FeedStoreItem> {
        return this.feedStorageService.update(feedItem);
    }
}