import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionFeedbackComponent } from './action-feedback.component';

describe('CreateSystemUserComponent', () => {
  let component: ActionFeedbackComponent;
  let fixture: ComponentFixture<ActionFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
