import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEntityViewFiltersComponent } from './create-entity-view-filters.component';

describe('CreateEntityViewFiltersComponent', () => {
  let component: CreateEntityViewFiltersComponent;
  let fixture: ComponentFixture<CreateEntityViewFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEntityViewFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEntityViewFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
