import { AfterContentInit, Component, EventEmitter, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Channel, Topic, TopicService } from 'src/app/core/topic-service/topic.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: 'nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss'],    
})
export class NavBarComponent implements AfterContentInit {

    topic!: Topic;

    @Output() channelChange = new EventEmitter<Channel>();

    selected!: Channel;

    channels!: Channel[];

    constructor(private route: ActivatedRoute, private topicService: TopicService) { }

    ngAfterContentInit(): void {
        this.route.params.subscribe(p => {
            this.topicService.getTopic(p.topicId).then(val => {
                this.topic = val;
                this.initialize();
            });
        });
    }

    initialize() {
        this.channels = this.topic?.channels ?? [];
        this.nextChannel();
    }

    // User selection
    onSelectionChange() {
        this.emitChannelChange();
    }

    nextChannel(): void {
        if (this.selected) {
            const index = this.channels.findIndex(channel => channel.title === this.selected.title);
            this.selected = this.channels[(index+1)%this.channels.length];
        } else {
            this.selected = this.channels[0];
        }
        this.emitChannelChange();
    }

    emitChannelChange() {
        this.channelChange.emit(this.selected);
    }
}