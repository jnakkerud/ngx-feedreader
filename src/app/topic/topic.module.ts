import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { TopicComponent } from "./topic.component";
import { ChannelDetailComponent } from './channel-detail/channel-detail.component';
import { TopicRoutingModule } from './topic-routing.module';
import { MaterialModule } from '../material.module';
import { ChannelNavBarComponent } from './channel-nav-bar/channel-nav-bar.component';
import { SavedDetailComponent } from './saved/saved-detail.component';
import { FeedsComponent } from './feeds/feeds.component';
import { HomeTopicComponent } from './home/home-topic.component';
import { StripTagsPipe } from './feeds/strip-tags.pipe';
import { FeedArticleComponent } from './feed-article/feed-article.component';
import { HeaderModule } from '../header/header.component';

@NgModule({
    imports: [
        CommonModule,
        TopicRoutingModule,
        MaterialModule,
        HeaderModule
    ],
    exports: [TopicComponent, 
        ChannelDetailComponent, 
        ChannelNavBarComponent,
        FeedsComponent,
        HomeTopicComponent,
        StripTagsPipe,
        FeedArticleComponent,
        SavedDetailComponent],
    declarations: [TopicComponent, 
        ChannelDetailComponent, 
        ChannelNavBarComponent,
        FeedsComponent,
        HomeTopicComponent,
        StripTagsPipe,
        FeedArticleComponent,
        SavedDetailComponent],
  })
export class TopicModule {}