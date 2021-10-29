import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Channel } from '../topic-service/topic.service';
import { FeedReader } from './feed-reader';
import { FeedStorageService, FeedStoreItem, FilterBy } from './feed-storage.service';
import { proxyConfig } from '../../proxy-config';

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

const httpOptions: Object = {
    headers: new HttpHeaders(proxyConfig.headers),
    responseType: 'text'
};
@Injectable({providedIn: 'root'})
export class FeedService {

    private feedReader = new FeedReader();

    constructor(private httpClient: HttpClient, private feedStorageService: FeedStorageService) {}
    
    getFeed(channel: Channel): Promise<Feed> {
        return new Promise<Feed>(resolve => {
            this.httpClient.get<string>(`${proxyConfig.proxy}/${channel.xmlUrl}`, httpOptions)
                .subscribe(response => {
                    let feed = this.feedReader.read(response);
                    feed.title = channel.name;
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
                value: channels[0].name
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
    
        filterBy.push(
            {
                filterName: 'markedAsRead',
                value: false
            }
        )
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