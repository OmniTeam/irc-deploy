import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEntityViewsComponent } from './create-entity-views.component';

describe('CreateEntityViewsComponent', () => {
  let component: CreateEntityViewsComponent;
  let fixture: ComponentFixture<CreateEntityViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEntityViewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEntityViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
