import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEntityViewsComponent } from './edit-entity-views.component';

describe('EditEntityViewsComponent', () => {
  let component: EditEntityViewsComponent;
  let fixture: ComponentFixture<EditEntityViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEntityViewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEntityViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
