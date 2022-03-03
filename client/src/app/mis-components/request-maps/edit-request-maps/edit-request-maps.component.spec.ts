import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRequestMapsComponent } from './edit-request-maps.component';

describe('EditRequestMapsComponent', () => {
  let component: EditRequestMapsComponent;
  let fixture: ComponentFixture<EditRequestMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRequestMapsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRequestMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
