import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PortalModule } from '@angular/cdk/portal';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

const modules: any[] = [
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    CdkAccordionModule,
    MatTreeModule,
    MatProgressSpinnerModule,
    PortalModule,
    MatInputModule,
    MatCheckboxModule
];

@NgModule({
  imports: [ ...modules ],
  exports: [ ...modules ]

})
export class MaterialModule { }