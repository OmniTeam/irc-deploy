import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityViewTableComponent } from './entity-view-table.component';

describe('EntityViewTableComponent', () => {
  let component: EntityViewTableComponent;
  let fixture: ComponentFixture<EntityViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityViewTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
