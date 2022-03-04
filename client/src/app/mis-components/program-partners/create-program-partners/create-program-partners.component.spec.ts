import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProgramPartnersComponent } from './create-program-partners.component';

describe('CreateProgramPartnersComponent', () => {
  let component: CreateProgramPartnersComponent;
  let fixture: ComponentFixture<CreateProgramPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProgramPartnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProgramPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
