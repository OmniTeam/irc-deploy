import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AclGroupMappingEditComponent } from './acl-group-mapping-edit.component';

describe('CreateSystemUserComponent', () => {
  let component: AclGroupMappingEditComponent;
  let fixture: ComponentFixture<AclGroupMappingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AclGroupMappingEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AclGroupMappingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
