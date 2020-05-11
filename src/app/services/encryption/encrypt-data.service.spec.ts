import { TestBed, inject } from '@angular/core/testing';

import { EncryptDataService } from './encrypt-data.service';

describe('EncryptDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EncryptDataService]
    });
  });

  it('should be created', inject([EncryptDataService], (service: EncryptDataService) => {
    expect(service).toBeTruthy();
  }));
});
