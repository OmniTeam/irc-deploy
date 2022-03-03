import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectMilestonesComponent } from './create-project-milestones.component';

describe('CreateProjectMilestonesComponent', () => {
  let component: CreateProjectMilestonesComponent;
  let fixture: ComponentFixture<CreateProjectMilestonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProjectMilestonesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectMilestonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
