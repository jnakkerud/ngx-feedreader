import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Topic, TopicService } from '../core/topic-service/topic.service';
import { map } from 'rxjs/operators'; 
import { MatSidenav } from '@angular/material/sidenav';

const EXTRA_SMALL_WIDTH_BREAKPOINT = 720;
const SMALL_WIDTH_BREAKPOINT = 959;
@Component({
    selector: 'app-topic',
    templateUrl: './topic.component.html',
    styleUrls: ['./topic.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TopicComponent {
    @ViewChild(MatSidenav) sidenav!: MatSidenav;
    
    topics: Promise<Topic[]>;

    isExtraScreenSmall: Observable<boolean>;
    isScreenSmall: Observable<boolean>;

    constructor(breakpoints: BreakpointObserver, private topicService: TopicService) {
        this.topics = this.topicService.getTopics();

        this.isExtraScreenSmall =
            breakpoints.observe(`(max-width: ${EXTRA_SMALL_WIDTH_BREAKPOINT}px)`)
                .pipe(map(breakpoint => breakpoint.matches));

        this.isScreenSmall = breakpoints.observe(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`)
            .pipe(map(breakpoint => breakpoint.matches));        
    }

    toggleSidenav(): void {
        this.sidenav.toggle();
    }    
}