import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {landingRouting} from './app.routing';
import { AdminRoutesComponent } from './admin/admin-routes/admin-routes.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { InitFrameComponent } from './users/init-frame/init-frame.component';

@NgModule({
  declarations: [
    AppComponent,
    landingRouting.components
  ],
  imports: [
    BrowserModule,
    landingRouting.routes
  ],
  providers: [landingRouting.providers],
  bootstrap: [AppComponent]
})
export class AppModule { }
