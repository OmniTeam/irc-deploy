import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateActivityReportComponent } from './create-activity-report.component';

describe('CreateActivityReportComponent', () => {
  let component: CreateActivityReportComponent;
  let fixture: ComponentFixture<CreateActivityReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateActivityReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateActivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
