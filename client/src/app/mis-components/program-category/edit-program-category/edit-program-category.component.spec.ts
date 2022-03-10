import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProgramCategoryComponent } from './edit-program-category.component';

describe('EditProgramCategoryComponent', () => {
  let component: EditProgramCategoryComponent;
  let fixture: ComponentFixture<EditProgramCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProgramCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProgramCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
