import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { TopicStorageService } from '../core/topic-service/topic-storage.service';
import { FeedStorageService } from '../core/feed-service/feed-storage.service';
@Component({
    selector: 'app-reset',
    templateUrl: 'reset.component.html'
})
export class ResetComponent {

    constructor(private topicStorageService: TopicStorageService, private feedStorageService: FeedStorageService) { }

    resetTopics(): void {         
    }

    resetDb(): void{      
        // this.feedStorageService.deleteDb().then(() => console.log('Delete DB done'));           
    }

    resetAll(): void{
        // redirect to config     
    }
}

@NgModule({
    imports: [
        CommonModule, MaterialModule, RouterModule],
    exports: [ResetComponent],
    declarations: [ResetComponent],
  })
export class ResetModule {}