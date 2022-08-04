import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigService } from '../core/config-service/config.service';
import { MaterialModule } from '../material.module';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

    title: string;

    constructor(private configService: ConfigService) { 
        this.title = this.configService.title;
    }
}

@NgModule({
    imports: [
        CommonModule, MaterialModule, RouterModule],
    exports: [HeaderComponent],
    declarations: [HeaderComponent],
  })
export class HeaderModule {}