import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEntityViewFiltersComponent } from './edit-entity-view-filters.component';

describe('EditEntityViewFiltersComponent', () => {
  let component: EditEntityViewFiltersComponent;
  let fixture: ComponentFixture<EditEntityViewFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEntityViewFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEntityViewFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
