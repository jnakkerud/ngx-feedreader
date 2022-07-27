import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OpmlReader } from './opml-reader';
import { TopicStorageService } from './topic-storage.service';

// http://localhost:4200/?topics=%2Fassets%2Fsample%2Fsample.opml
function getTopicsUrl() {
    const queryString = window.location.search;
    if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        const topicsUrl = urlParams.get('topics');
        if (topicsUrl) {
            // and decode it
            return decodeURI(topicsUrl);
        }
    }
    return null;
}

export type FeedType = 'rss' | 'atom' | 'unknown';
export interface Channel {
    name: string;
    type: FeedType
    xmlUrl: string;
    htmlUrl: string
}
export interface Topic {
    name: string;
    description?: string;
    channels?: Channel[];
}

@Injectable({providedIn: 'root'})
export class TopicService {

    constructor(private httpClient: HttpClient, private topicsStorage: TopicStorageService, private router: Router) { }
    
    public async getTopics(): Promise<Topic[]> {
        // get topics from storage:  TopicStorageService
        // if topics not in storage, then see if an OPML file is specified in the url
        //    Load from url and read with OpmlReader. Write to storage
        // else redirect to config screen
        return new Promise<Topic[]>((resolve) => {            
            // get topics from local storage
            let topics = this.topicsStorage.get();
            if (!topics?.length) {
                // load from URL
                const topicsUrl = getTopicsUrl();
                if (topicsUrl) {
                    this.getConfigFromUrl(topicsUrl)
                        .subscribe(response => {
                            let topics = this.loadTopics(response);
                            this.saveTopics(topics);
                            resolve(topics);            
                        },
                        error => {
                            console.log(error);
                            this.redirectToConfig();
                        }                        
                    );
                } else {
                    this.redirectToConfig();
                }    
            } else {
                resolve(topics);
            }            
        });
    }

    public getTopic(name: string): Promise<Topic> {
        return new Promise<Topic>((resolve, reject) => {
            this.getTopics().then(topics => {
                let topic = topics.find(t => t.name === name);
                if (topic) {
                    resolve(topic);
                }
                reject('Cannot find topic');
            });
        });        
    }

    public loadTopics(data: string): Topic[] {
        const opmlReader = new OpmlReader();
        return opmlReader.read(data);
    }

    public saveTopics(topics: Topic[]): void {
        this.topicsStorage.put(topics);        
    }

    public hasTopics(): boolean {
        const topics = this.topicsStorage.get();
        return topics?.length > 0;  
    }

    private getConfigFromUrl(url: string): Observable<any> {
        return this.httpClient.get(url, { responseType: 'text' });
    }

    private redirectToConfig(): void {
        this.router.navigate(['/config']);
    }
}