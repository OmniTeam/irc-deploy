import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisFormsComponent } from './mis-forms.component';

describe('MisFormsComponent', () => {
  let component: MisFormsComponent;
  let fixture: ComponentFixture<MisFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
