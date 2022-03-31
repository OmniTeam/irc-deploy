import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AclGroupMappingParentComponent } from './acl-group-mapping-parent.component';

describe('CreateSystemUserComponent', () => {
  let component: AclGroupMappingParentComponent;
  let fixture: ComponentFixture<AclGroupMappingParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AclGroupMappingParentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AclGroupMappingParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
