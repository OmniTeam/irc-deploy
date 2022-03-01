import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionReferralComponent } from './action-referral.component';

describe('CreateSystemUserComponent', () => {
  let component: ActionReferralComponent;
  let fixture: ComponentFixture<ActionReferralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionReferralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
