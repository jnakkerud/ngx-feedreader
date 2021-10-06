import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { TopicComponent } from "./topic.component";
import { ChannelDetailComponent } from './channel-detail/channel-detail.component';
import { TopicRoutingModule } from './topic-routing.module';
import { MaterialModule } from '../material.module';
import { ChannelNavBarComponent } from './channel-nav-bar/channel-nav-bar.component';
import { SavedDetailComponent } from './saved/saved-detail.component';
import { FeedsComponent } from './feeds/feeds.component';

@NgModule({
    imports: [
        CommonModule,
        TopicRoutingModule,
        MaterialModule
    ],
    exports: [TopicComponent, 
        ChannelDetailComponent, 
        ChannelNavBarComponent,
        FeedsComponent,
        SavedDetailComponent],
    declarations: [TopicComponent, 
        ChannelDetailComponent, 
        ChannelNavBarComponent,
        FeedsComponent,
        SavedDetailComponent],
  })
export class TopicModule {}