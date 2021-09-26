import { Injectable } from '@angular/core';

import { FeedItem } from './feed.service';

export interface FeedStoreItem extends FeedItem {
    // topicName: string;
    channelName: string;
    saved: boolean;
}

export type IndexFilterName = 'topicName' | 'channelName' | 'saved';

const DB_NAME = 'ngxFeeds';
const DB_VERSION = 4;
const STORE_NAME = 'feedItem';

@Injectable({providedIn: 'root'})
export class FeedStorageService {

    private indexedDB: IDBFactory;

    constructor() { 
        this.indexedDB =
            window.indexedDB ||
            (window as any).mozIndexedDB ||
            (window as any).webkitIndexedDB ||
            (window as any).msIndexedDB;
        this.createObjectStore();
    }
    
    public getItems(indexName: IndexFilterName, filter: any): Promise<FeedStoreItem[]> {
        const data: FeedStoreItem[] = [];
        return new Promise<FeedStoreItem[]>((resolve, reject) => {
            this.openDatabase().then(db => {
                const objectStore = this.createTransaction(db).objectStore(STORE_NAME);
                const index = objectStore.index(indexName);
                const request = index.openCursor(IDBKeyRange.only(filter));
                request.onsuccess = (event) => {
                    const cursor: IDBCursorWithValue = (event.target as IDBRequest<IDBCursorWithValue>).result;
                    if (cursor) {
                        data.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(data.sort((a,b)=>b.pubDate.getTime()-a.pubDate.getTime()));
                    }
                };
            }).catch((reason) => reject(reason));
        });
    }

    public update(updateItem: FeedStoreItem): Promise<FeedStoreItem> {
        return new Promise<FeedStoreItem>((resolve, reject) => {
            this.openDatabase().then(db => {
                const objectStore = this.createTransaction(db).objectStore(STORE_NAME);
                const request = objectStore.get(updateItem.link);
                request.onsuccess = () => {
                    let data: FeedStoreItem = Object.assign(request.result, updateItem);
                    const updateRequest = objectStore.put(data);
                    updateRequest.onsuccess = () => {
                        resolve(data);
                    }                    
                };
            }).catch((reason) => reject(reason));
        });
    }

    public delete(filterBy: IndexFilterName, value: any): void {
    }

    public add(items: FeedStoreItem[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.openDatabase().then(db => {
                const transaction = this.createTransaction(db);
                const objectStore = transaction.objectStore(STORE_NAME);
                items.forEach(item => objectStore.add(item));
                transaction.oncomplete = () => {
                    resolve(true);
                };
            }).catch((reason) => reject(reason));
        });
    }

    private openDatabase(): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>((resolve, reject) => {
            if (!this.indexedDB) {
                reject('IndexedDB not available');
            }
            const request = this.indexedDB.open(DB_NAME, DB_VERSION);
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = () => {
                reject(`IndexedDB error: ${request.error}`);
            };
        });
    }

    private createObjectStore() {
        const request = this.indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const database: IDBDatabase = (event.target as any).result;

            const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'link' });

            objectStore.createIndex('title', 'title', { unique: false });
            objectStore.createIndex('description', 'description', { unique: false });
            objectStore.createIndex('pubDate', 'pubDate', { unique: false });
            objectStore.createIndex('topicName', 'topicName', { unique: false });
            objectStore.createIndex('channelName', 'channelName', { unique: false });
            objectStore.createIndex('saved', 'saved', { unique: false });

            database.close();
        };
    }

    private createTransaction(db: IDBDatabase): IDBTransaction {
        return db.transaction(STORE_NAME, 'readwrite');
    }
}