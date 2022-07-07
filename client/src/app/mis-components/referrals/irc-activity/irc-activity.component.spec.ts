import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcActivityComponent } from './irc-activity.component';

describe('IrcActivityComponent', () => {
  let component: IrcActivityComponent;
  let fixture: ComponentFixture<IrcActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrcActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IrcActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
