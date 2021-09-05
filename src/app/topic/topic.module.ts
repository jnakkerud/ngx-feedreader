import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { TopicComponent } from "./topic.component";
import { TopicDetailComponent } from './detail/topic-detail.component';
import { TopicRoutingModule } from './topic-routing.module';
import { MaterialModule } from '../material.module';

@NgModule({
    imports: [
        CommonModule,
        TopicRoutingModule,
        MaterialModule
    ],
    exports: [TopicComponent, TopicDetailComponent],
    declarations: [TopicComponent, TopicDetailComponent],
  })
export class TopicModule {}