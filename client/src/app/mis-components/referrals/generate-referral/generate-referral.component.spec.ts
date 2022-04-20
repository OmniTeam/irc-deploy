import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateReferralComponent } from './generate-referral.component';

describe('GenerateReferralComponent', () => {
  let component: GenerateReferralComponent;
  let fixture: ComponentFixture<GenerateReferralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateReferralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
