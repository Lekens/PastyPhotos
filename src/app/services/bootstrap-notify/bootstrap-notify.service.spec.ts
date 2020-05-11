import { TestBed } from '@angular/core/testing';

import { BootstrapNotifyService } from './bootstrap-notify.service';

describe('BootstrapNotifyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BootstrapNotifyService = TestBed.get(BootstrapNotifyService);
    expect(service).toBeTruthy();
  });
});
