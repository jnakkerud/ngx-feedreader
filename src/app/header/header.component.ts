import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}

@NgModule({
    imports: [
        CommonModule, MaterialModule, RouterModule],
    exports: [HeaderComponent],
    declarations: [HeaderComponent],
  })
export class HeaderModule {}