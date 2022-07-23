import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { TopicStorageService } from '../core/topic-service/topic-storage.service';
import { FeedStorageService } from '../core/feed-service/feed-storage.service';
@Component({
    selector: 'app-reset',
    templateUrl: 'reset.component.html'
})
export class ResetComponent {

    constructor(
        private topicStorageService: TopicStorageService, 
        private feedStorageService: FeedStorageService, 
        private router: Router) { }

    resetTopics(): void {
        this.topicStorageService.delete();
        this.redirectToConfig();     
    }

    resetDb(): void{      
        this.feedStorageService.rebuildDb().then(() => this.redirectToConfig());       
    }

    resetAll(): void{
        this.topicStorageService.delete();
        this.feedStorageService.rebuildDb().then(() => this.redirectToConfig());       
    }

    private redirectToConfig(): void {
        this.router.navigate(['/config']);
    }

}

@NgModule({
    imports: [
        CommonModule, MaterialModule, RouterModule],
    exports: [ResetComponent],
    declarations: [ResetComponent],
  })
export class ResetModule {}