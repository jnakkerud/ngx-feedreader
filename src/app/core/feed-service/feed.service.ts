import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Channel, FeedType } from '../topic-service/topic.service';
import { FeedReader } from './feed-reader';
import { FeedStorageService, FeedStoreItem, filter, FilterBy, FilterFn } from './feed-storage.service';
import { proxyConfig } from '../../app-config';
import { EvictionService } from '../eviction-service/eviction.service';

export interface FeedItem {
    title: string;
    description: string;
    link: string;
    pubDate: Date;
}

export interface Feed {
    title: string;
    link?: string;
    description?: string;
    image?: string;
    type?: FeedType;
    items: FeedItem[];
}

const httpOptions: Object = {
    headers: new HttpHeaders(proxyConfig.headers),
    responseType: 'text'
};

@Injectable({providedIn: 'root'})
export class FeedService {

    private feedReader = new FeedReader();

    private cachedFeeds = new Set<string>();

    constructor(private httpClient: HttpClient, private feedStorageService: FeedStorageService, private evictionService: EvictionService) {}
    
    getFeed(channel: Channel): Promise<Feed> {
        return new Promise<Feed>(resolve => {
            this.httpClient.get<string>(`${proxyConfig.proxy}/${channel.xmlUrl}`, httpOptions)
                .subscribe(response => {
                    let feed = this.feedReader.read(response, channel.type);
                    feed.title = channel.name === '' ? feed.title : channel.name;
                    resolve(feed); 
                },
                error => {
                    console.log('Error loading feed:', error.message);
                    resolve({title: channel.name, items: []});
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

    public async loadFeeds(channels: Channel[]): Promise<FeedStoreItem[]> {
        return new Promise<FeedStoreItem[]>(resolve => {
            const feedSrc = channels.map(c => this.loadFeed(c));
            Promise.all(feedSrc).then(result => {
                let items: FeedStoreItem[] = [];
                resolve(items.concat.apply([], result));
            });
        });
    }

    public async loadFeed(channel: Channel): Promise<FeedStoreItem[]> {
        const filterBy: FilterBy[] = [
            {
                filterName: 'channelName',
                value: channel.name
            }
        ]

        // if feed not cached, call feed url
        if (!this.cachedFeeds.has(channel.xmlUrl)) {
            let storeItems = await this.feedStorageService.getItems(filter(filterBy), 1);
            const latest = storeItems?.length ? storeItems[0].pubDate : new Date(628021800000); // 1989

            // get feeds via url
            let feedItems = await this.getFeedItems([channel]);

            // save the latest feeds
            let newItems = feedItems.filter(i => {
                return i.pubDate.getTime() > latest.getTime();
            });

            if (newItems?.length) {
                await this.feedStorageService.add(newItems);
            }
        }
    
        // cached feed
        this.cachedFeeds.add(channel.xmlUrl);

        filterBy.push(
            {
                filterName: 'markedAsRead',
                value: false
            }
        )
        return this.feedStorageService.getItems(filter(filterBy));
    }

    public async loadSavedFeeds(): Promise<FeedStoreItem[]> {
        const filterBy: FilterBy[] = [
            {
                filterName: 'saved',
                value: true
            }        ]    
        return this.feedStorageService.getItems(filter(filterBy));
    }


    public updateFeed(feedItem: FeedStoreItem): Promise<FeedStoreItem> {
        return this.feedStorageService.update(feedItem);
    }

    // load channels from storage and see if the channel name exists in channelNames array
    // if not, mark for deletion
    public async syncFeeds(channelNames: string[]) {
        console.log('syncFeeds', channelNames);

        const filter: FilterFn = (cursor: IDBCursorWithValue): boolean => {
            const feedItem: FeedStoreItem = cursor.value;
            if (!channelNames.includes(feedItem.channelName)) {
                return true;
            }
            return false;
        }

        const feedItems: FeedStoreItem[] = await this.feedStorageService.getItems(filter);        

        if (feedItems?.length > 0) {
            this.evictionService.markAndEvict(feedItems);
        }
    }    
}