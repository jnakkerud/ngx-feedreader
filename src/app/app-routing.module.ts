import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicComponent } from './topic/topic.component';

const routes: Routes = [
    { path: 'topic/:topicId', component: TopicComponent },
    { path: '', redirectTo: 'topic/saved', pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
