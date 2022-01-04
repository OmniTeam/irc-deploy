import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEntitiesComponent } from './create-entities.component';

describe('CreateEntitiesComponent', () => {
  let component: CreateEntitiesComponent;
  let fixture: ComponentFixture<CreateEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEntitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
