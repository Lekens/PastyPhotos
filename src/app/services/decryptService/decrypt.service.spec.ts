import { TestBed, inject } from '@angular/core/testing';

import { DecryptService } from './decrypt.service';

describe('DecryptService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DecryptService]
    });
  });

  it('should be created', inject([DecryptService], (service: DecryptService) => {
    expect(service).toBeTruthy();
  }));
});
