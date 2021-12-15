import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTablesComponent } from './entity-tables.component';

describe('EntityTablesComponent', () => {
  let component: EntityTablesComponent;
  let fixture: ComponentFixture<EntityTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityTablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
