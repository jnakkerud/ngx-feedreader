import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Channel, Topic } from 'src/app/core/topic-service/topic.service';
@Component({
    selector: 'app-channel-nav-bar',
    templateUrl: 'channel-nav-bar.component.html',
    styleUrls: ['./channel-nav-bar.component.scss'],    
})
export class ChannelNavBarComponent {

    selected: Channel | null = null;

    @Input()
    get topic(): Topic {
        return this._topic!;
    }
    set topic(topic: Topic) {
        if (this._topic !== topic) {
            this.switchTopic(topic);
        }
    }
    private _topic?: Topic;
  
    @Output() channelChange = new EventEmitter<Channel>();

    get channels(): Channel[] {
        return this.topic?.channels ?? [];
    }

    // User selection
    onSelectionChange() {
        this.emitChannelChange();
    }

    nextChannel(): void {
        if (this.selected) {
            const index = this.channels.findIndex(channel => channel.name === this.selected?.name);
            this.selected = this.channels[(index+1)%this.channels.length];
        } else {
            this.selected = this.channels[0];
        }
        this.emitChannelChange();
    }

    emitChannelChange() {
        if (this.selected) {
            this.channelChange.emit(this.selected);
        }
    }

    private switchTopic(topic: Topic) {
        this._topic = topic;
        this.selected = null;
        this.nextChannel();
    }
}