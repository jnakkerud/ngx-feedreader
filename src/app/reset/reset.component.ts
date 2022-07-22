import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

@Component({
    selector: 'app-reset',
    templateUrl: 'reset.component.html'
})
export class ResetComponent {

    constructor() { }

    resetTopics(): void{         
    }

    resetDb(): void{         
    }

    resetAll(): void{         
    }
}

@NgModule({
    imports: [
        CommonModule, MaterialModule, RouterModule],
    exports: [ResetComponent],
    declarations: [ResetComponent],
  })
export class ResetModule {}