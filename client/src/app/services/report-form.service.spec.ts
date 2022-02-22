import { TestBed } from '@angular/core/testing';

import { ReportFormService } from './report-form.service';

describe('FormViewService', () => {
  let service: ReportFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
