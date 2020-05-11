import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NotificationService} from '../../../services/notificationServices/notification.service';
import {EventsService} from '../../../services/eventServices/event.service';
import {NavigatorService} from '../../../services/navigatorService/navigator.service';
import {DecryptService} from '../../../services/decryptService/decrypt.service';
import {GuardService} from '../../../services/gaurdService/guard.service';
import {EncryptDataService} from '../../../services/encryption/encrypt-data.service';
import {CacheService} from '../../../services/cacheService/cache.service';
import {NotifyComponent} from '../../components/notify/notify.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    NotifyComponent
  ],
  entryComponents: [],
  providers: [
    NotificationService,
    EventsService,
    NavigatorService,
    DecryptService,
    GuardService,
    EncryptDataService,
    CacheService,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModules { }
