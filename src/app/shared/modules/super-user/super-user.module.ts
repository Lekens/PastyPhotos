import { NgModule } from '@angular/core';
import {SharedModules} from '../shared/shared.module';
import { superUserRouting } from '../../../app.routing';

@NgModule({
  imports: [
    SharedModules,
    superUserRouting.routes
  ],
  providers: [
    superUserRouting.providers
  ],
  entryComponents: [
    superUserRouting.entryComponent,
  ],
  declarations: [
    superUserRouting.components
  ],
  exports: [
    superUserRouting.components
  ]
})
export class SuperUserModule { }
