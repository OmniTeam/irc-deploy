import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AclGroupMappingListsComponent } from './acl-group-mapping-lists.component';

describe('TagsComponent', () => {
  let component: AclGroupMappingListsComponent;
  let fixture: ComponentFixture<AclGroupMappingListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AclGroupMappingListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AclGroupMappingListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
