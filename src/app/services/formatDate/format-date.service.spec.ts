import {inject, TestBed} from '@angular/core/testing';

import {FormatDateService} from './format-date.service';

describe('FormatDateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormatDateService]
    });
  });

  it('should be created', inject([FormatDateService], (service: FormatDateService) => {
    expect(service).toBeTruthy();
  }));
});
