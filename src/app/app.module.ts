import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {landingRouting} from './app.routing';
import {SharedModules} from './shared/modules/shared/shared.module';
import {environment as ENV } from '../environments/environment';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/analytics';
import {HttpClientModule} from '@angular/common/http';
import {NotifyComponent} from "./shared/components/notify/notify.component";
// import {AngularCropperjsModule} from "angular-cropperjs";

firebase.initializeApp(ENV.FIREBASE);
firebase.analytics();

@NgModule({
  declarations: [
    AppComponent,
    landingRouting.components,
    NotifyComponent
  ],
  imports: [
    BrowserModule,
    SharedModules,
    HttpClientModule,
    // AngularCropperjsModule,
    landingRouting.routes
  ],
  providers: [landingRouting.providers],
  bootstrap: [AppComponent]
})
export class AppModule { }
