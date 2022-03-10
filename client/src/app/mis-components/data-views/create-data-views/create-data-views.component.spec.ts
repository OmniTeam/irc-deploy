import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDataViewsComponent } from './create-data-views.component';

describe('CreateDataViewsComponent', () => {
  let component: CreateDataViewsComponent;
  let fixture: ComponentFixture<CreateDataViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDataViewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDataViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
