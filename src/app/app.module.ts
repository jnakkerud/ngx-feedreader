import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { TopicModule } from './topic/topic.module';
import { ConfigModule } from './config/config.component';
import { ResetModule } from './reset/reset.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    TopicModule,
    ConfigModule,
    ResetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
