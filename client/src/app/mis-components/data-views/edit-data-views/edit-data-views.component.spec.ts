import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDataViewsComponent } from './edit-data-views.component';

describe('EditDataViewsComponent', () => {
  let component: EditDataViewsComponent;
  let fixture: ComponentFixture<EditDataViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDataViewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDataViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
