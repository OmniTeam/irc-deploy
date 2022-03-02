import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequestMapsComponent } from './create-request-maps.component';

describe('CreateRequestMapsComponent', () => {
  let component: CreateRequestMapsComponent;
  let fixture: ComponentFixture<CreateRequestMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRequestMapsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRequestMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
