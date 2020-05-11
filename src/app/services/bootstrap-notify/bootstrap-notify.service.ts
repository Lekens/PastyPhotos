import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap-notify';


@Injectable({
  providedIn: 'root'
})
export class BootstrapNotifyService {
  private options = {
    type: null,
    // mouse_over: 'pause',
    delay: 5000,
    z_index: 999999999999999999,
    showProgressbar: false,
    allow_dismiss: true,
    placement: {align: 'center'}
  };
  constructor() {  }
   private close () {
  // notify.close();
  }
  public custom(type = 'danger', title = 'Notification', msg) {
    const notify = $.notify({ message: '' }, this.options);
    notify.update('type', type);
    notify.update('title', `<strong >${title}</strong>`);
    notify.update('message', `<p>&nbsp;${msg}</p>`);
  }
  public success(msg: string, position = 'right') {
    this.options.placement.align = position;
    const notify = $.notify({ message: '' }, this.options);
    notify.update('type', 'success');
    notify.update('title', '<strong style="">Success</strong>');
    notify.update('message', `<p>&nbsp;${msg}</p>`);
    notify.update('icon', 'fa fa-check');
  }
  public error(msg: string, position = 'right') {
    this.options.placement.align = position;
    const notify = $.notify({ message: '' }, this.options);
    notify.update('type', 'danger');
    notify.update('title', '<strong style="">Error</strong>');
    notify.update('message', `<p>&nbsp;${msg}</p>`);
    notify.update('icon', 'fa fa-warning');
  }
  public info(msg: string, position = 'right') {
    this.options.placement.align = position;
    const notify = $.notify({ message: '' }, this.options);
    notify.update('type', 'info');
    notify.update('title', '<strong style="">Info</strong>');
    notify.update('message', `<p>&nbsp;${msg}</p>`);
    notify.update('icon', 'fa fa-info');
  }
  public warning(msg: string, position = 'right') {
    this.options.placement.align = position;
    const notify = $.notify({ message: '' }, this.options);
    notify.update('type', 'warning');
    notify.update('title', '<strong style="">Warning</strong>');
    notify.update('message', `<p>&nbsp;${msg}</p>`);
    notify.update('icon', 'fa fa-warning');
  }
}
