import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChannelDetailComponent } from './channel-detail/channel-detail.component';
import { TopicComponent } from './topic.component';
import { SavedDetailComponent } from './saved/saved-detail.component';
import { HomeTopicComponent } from './home/home-topic.component';

const routes: Routes = [
    { path: '', component: TopicComponent,
        children: [
            { path: '', redirectTo: 'home-topic', pathMatch: 'full' },
            { path: 'saved-for-later', component: SavedDetailComponent },
            { path: 'home-topic', component: HomeTopicComponent },
            { path: ':topicId', component: ChannelDetailComponent }
        ]        
    },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicRoutingModule {}