import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopicDetailComponent } from './detail/topic-detail.component';
import { TopicComponent } from './topic.component';

const routes: Routes = [
    { path: '', component: TopicComponent,
        children: [
            //{ path: '', redirectTo: 'saved', pathMatch: 'full' },
            { path: ':topicId', component: TopicDetailComponent }
        ]        
    },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicRoutingModule {}