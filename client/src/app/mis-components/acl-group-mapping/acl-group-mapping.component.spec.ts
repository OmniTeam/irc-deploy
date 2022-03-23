import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AclGroupMappingComponent } from './acl-group-mapping.component';

describe('CreateSystemUserComponent', () => {
  let component: AclGroupMappingComponent;
  let fixture: ComponentFixture<AclGroupMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AclGroupMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AclGroupMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
