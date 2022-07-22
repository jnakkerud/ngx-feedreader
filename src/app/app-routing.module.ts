import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { ResetComponent } from './reset/reset.component';

const routes: Routes = [
    { path: 'config', component: ConfigComponent },
    { path: 'reset', component: ResetComponent },
    {   path: 'topic',
        loadChildren: () => import('./topic/topic.module').then(m => m.TopicModule)
    },
    { path: '', redirectTo: 'topic', pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
