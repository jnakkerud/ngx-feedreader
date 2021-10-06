import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChannelDetailComponent } from './channel-detail/channel-detail.component';
import { TopicComponent } from './topic.component';
import { SavedDetailComponent } from './saved/saved-detail.component';

const routes: Routes = [
    { path: '', component: TopicComponent,
        children: [
            //{ path: '', redirectTo: 'saved', pathMatch: 'full' },
            { path: 'saved-for-later', component: SavedDetailComponent },
            { path: ':topicId', component: ChannelDetailComponent }
        ]        
    },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicRoutingModule {}