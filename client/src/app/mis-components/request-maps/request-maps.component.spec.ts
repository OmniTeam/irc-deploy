import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMapsComponent } from './request-maps.component';

describe('RequestMapsComponent', () => {
  let component: RequestMapsComponent;
  let fixture: ComponentFixture<RequestMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestMapsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
