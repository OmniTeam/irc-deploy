import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectMilestonesComponent } from './edit-project-milestones.component';

describe('EditProjectMilestonesComponent', () => {
  let component: EditProjectMilestonesComponent;
  let fixture: ComponentFixture<EditProjectMilestonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProjectMilestonesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProjectMilestonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
