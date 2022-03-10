import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProgramPartnersComponent } from './edit-program-partners.component';

describe('EditProgramPartnersComponent', () => {
  let component: EditProgramPartnersComponent;
  let fixture: ComponentFixture<EditProgramPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProgramPartnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProgramPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
