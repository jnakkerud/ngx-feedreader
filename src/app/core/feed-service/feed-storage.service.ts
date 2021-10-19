import { Injectable } from '@angular/core';

import { FeedItem } from './feed.service';

export interface FeedStoreItem extends FeedItem {
    // topicName: string;
    channelName: string;
    saved: boolean;
    markedAsRead: boolean;
}
export interface FilterBy {
    filterName: string;
    value: any;
}

export type IndexFilterName = 'topicName' | 'channelName' | 'saved';

function filter(item: any, filterBy: FilterBy[]): boolean  {
    for (const f of filterBy) {
        if (item[f.filterName] !== f.value) {
            return false;
        }
    }
    return true;
}

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
    
    public getItems(filterBy: FilterBy[], limit: number = Number.MAX_SAFE_INTEGER): Promise<FeedStoreItem[]> {
        const data: FeedStoreItem[] = [];
        return new Promise<FeedStoreItem[]>((resolve, reject) => {
            this.openDatabase().then(db => {
                const objectStore = this.createTransaction(db).objectStore(STORE_NAME);
                const request = objectStore.index('pubDate').openCursor(null, 'prev');
                request.onsuccess = (event) => {
                    const cursor: IDBCursorWithValue = (event.target as IDBRequest<IDBCursorWithValue>).result;
                    if (cursor) {
                        // filter
                        if (filter(cursor.value, filterBy)) {
                            data.push(cursor.value);
                        }
                        if (data.length < limit) {
                            cursor.continue();
                        } else {
                            resolve(data);
                        }                
                    } else {
                        resolve(data);
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

    public bulkUpdate(updateItems: FeedStoreItem[]): Promise<FeedStoreItem[]> {
        return new Promise<FeedStoreItem[]>((resolve, reject) => {
            this.openDatabase().then(db => {
                const objectStore = this.createTransaction(db).objectStore(STORE_NAME);
                // TODO bulk update
                //resolve(updateItems);
            }).catch((reason) => reject(reason));
        });
    }

    public delete(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.openDatabase().then(db => {
                const objectStore = this.createTransaction(db).objectStore(STORE_NAME);
                const request = objectStore.index('markedAsRead').openCursor(IDBKeyRange.only(true));
                request.onsuccess = (event) => {
                    const cursor: IDBCursorWithValue = (event.target as IDBRequest<IDBCursorWithValue>).result;
                    if (cursor) {
                        const item: FeedStoreItem = cursor.value;
                        if (item.saved !== true) {
                            cursor.delete();
                        }
                        cursor.continue();
                    } else {
                        resolve(true);
                    }
                };
            }).catch((reason) => reject(reason));
        });
    }

    public add(items: FeedStoreItem[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.openDatabase().then(db => {
                console.log('add items')
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
            objectStore.createIndex('markedAsRead', 'markedAsRead', { unique: false });

            database.close();
        };
    }

    private createTransaction(db: IDBDatabase): IDBTransaction {
        return db.transaction(STORE_NAME, 'readwrite');
    }
}