import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { TopicComponent } from "./topic.component";
import { TopicDetailComponent } from './detail/topic-detail.component';
import { TopicRoutingModule } from './topic-routing.module';
import { MaterialModule } from '../material.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SavedDetailComponent } from './saved/saved-detail.component';

@NgModule({
    imports: [
        CommonModule,
        TopicRoutingModule,
        MaterialModule
    ],
    exports: [TopicComponent, 
        TopicDetailComponent, 
        NavBarComponent, 
        SavedDetailComponent],
    declarations: [TopicComponent, 
        TopicDetailComponent, 
        NavBarComponent, 
        SavedDetailComponent],
  })
export class TopicModule {}