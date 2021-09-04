import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Topic, TopicService } from './core/topic-service/topic.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    mobileQuery!: MediaQueryList;

    topics!: Topic[];

    constructor(public mediaMatcher: MediaMatcher, private topicService: TopicService) {
        this.topics = this.topicService.getTopics();
    }

    ngOnInit() {
        this.mobileQuery = this.mediaMatcher.matchMedia('(min-width: 500px)');

        this.mobileQuery.addEventListener('change', this.myListener);
    }

    ngOnDestroy() {
        this.mobileQuery.removeEventListener('change', this.myListener);
    }

    myListener(event: { matches: any; }) {
        console.log(event.matches ? 'match' : 'no match');
    }

}