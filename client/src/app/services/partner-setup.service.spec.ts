import { TestBed } from '@angular/core/testing';

import { PartnerSetupService } from './partner-setup.service';

describe('PartnerSetupService', () => {
  let service: PartnerSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
