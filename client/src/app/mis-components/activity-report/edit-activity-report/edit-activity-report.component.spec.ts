import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActivityReportComponent } from './edit-activity-report.component';

describe('EditActivityReportComponent', () => {
  let component: EditActivityReportComponent;
  let fixture: ComponentFixture<EditActivityReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditActivityReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditActivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
