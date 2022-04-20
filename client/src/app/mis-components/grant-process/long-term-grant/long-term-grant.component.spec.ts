import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongTermGrantComponent } from './long-term-grant.component';

describe('LongTermGrantComponent', () => {
  let component: LongTermGrantComponent;
  let fixture: ComponentFixture<LongTermGrantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongTermGrantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongTermGrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
