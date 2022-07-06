import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcFeedbackComponent } from './irc-feedback.component';

describe('IrcFeedbackComponent', () => {
  let component: IrcFeedbackComponent;
  let fixture: ComponentFixture<IrcFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrcFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IrcFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
