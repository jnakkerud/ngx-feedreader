import { Component, Input, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'src/app/core/channel-service/channel.service';
import { Channel, Topic, TopicService } from 'src/app/core/topic-service/topic.service';

@Component({
    selector: 'app-topic-detail',
    templateUrl: 'topic-detail.component.html',
    styleUrls: ['./topic-detail.component.scss'],    
})

export class TopicDetailComponent implements OnInit {

    @Input() topic?: Topic;

    constructor(private route: ActivatedRoute, private topicService: TopicService, private channelService: ChannelService) { 
        this.route.params.subscribe(p => {
            this.topic = this.topicService.getTopic(p.topicId);
        });        
    }

    ngOnInit() { }

    onSelectionChange(change: MatSelectionListChange) {
        this.loadFeed(change.options[0].value);
    }

    loadFeed(channel: Channel) {
        this.channelService.load(channel);
    }
}