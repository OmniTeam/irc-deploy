import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagingBeneficiaryListComponent } from './staging-beneficiary-list.component';

describe('TagsComponent', () => {
  let component: StagingBeneficiaryListComponent;
  let fixture: ComponentFixture<StagingBeneficiaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StagingBeneficiaryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StagingBeneficiaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
