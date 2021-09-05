import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss']
})
export class ConfigComponent {
}

@NgModule({
    imports: [
        CommonModule],
    exports: [ConfigComponent],
    declarations: [ConfigComponent],
  })
export class ConfigModule {}