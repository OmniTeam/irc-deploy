import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingProcessComponent } from './reporting-process.component';

describe('ReportingProcessComponent', () => {
  let component: ReportingProcessComponent;
  let fixture: ComponentFixture<ReportingProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
