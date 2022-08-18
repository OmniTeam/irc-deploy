import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTagTypeComponent } from './edit-tag-type.component';

describe('EditTagTypeComponent', () => {
  let component: EditTagTypeComponent;
  let fixture: ComponentFixture<EditTagTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTagTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTagTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
