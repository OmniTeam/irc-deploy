import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityViewFiltersComponent } from './entity-view-filters.component';

describe('EntityViewFiltersComponent', () => {
  let component: EntityViewFiltersComponent;
  let fixture: ComponentFixture<EntityViewFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityViewFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityViewFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
