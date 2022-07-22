import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramPartnersComponent } from './program-partners.component';

describe('ProgramPartnersComponent', () => {
  let component: ProgramPartnersComponent;
  let fixture: ComponentFixture<ProgramPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramPartnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
