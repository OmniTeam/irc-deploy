import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerSetupComponent } from './partner-setup.component';

describe('PartnerSetupComponent', () => {
  let component: PartnerSetupComponent;
  let fixture: ComponentFixture<PartnerSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
