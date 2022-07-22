import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProgramCategoryComponent } from './create-program-category.component';

describe('CreateProgramCategoryComponent', () => {
  let component: CreateProgramCategoryComponent;
  let fixture: ComponentFixture<CreateProgramCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProgramCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProgramCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
