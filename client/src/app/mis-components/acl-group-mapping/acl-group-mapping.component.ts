import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Router} from '@angular/router';
import {GroupsService} from "../../services/groups.service";
import {UsersService} from "../../services/users.service";
import {TagService} from "../../services/tags";
import {AlertService} from "../../services/alert";
import {AuthService} from "../../services/auth.service";
import {FormService} from "../../services/form.service";
import {AclGroupMappingService} from "../../services/acl-group-mapping.service";

@Component({
  selector: 'app-create-group',
  templateUrl: './acl-group-mapping.component.html',
  styleUrls: ['./acl-group-mapping.component.scss']
})
export class AclGroupMappingComponent implements OnInit {
  ACD: boolean;

  constructor(
    private groupsService: GroupsService,
    private AalGroupMappingService: AclGroupMappingService,
    private formsService: FormService,
    private tagsService: TagService,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  clicked = false;
  currentDashboards: any
  formGroup: FormGroup
  formData: any;
  submitted = false;
  parents: any
  permissions = [
    {
      'permission': 0,
      'name': 'Read'
    },
    {
      'permission': 1,
      'name': 'Write'
    },
    {
      'permission': 2,
      'name': 'Administrator'
    },
  ]
  forms: any

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.formsService.getForms().subscribe(results => {
      this.forms = results
      console.log(results)
    }, error => {
      this.alertService.error("Failed to get Forms")
    })
    this.groupsService.getGroups().subscribe(results => {
      this.parents = results
      console.log(results)
    }, error => {
      this.alertService.error("Failed to get Groups")
    })
    this.formGroup = this.formBuilder.group({
      group: [null],
      form: [null],
      permissions: [null],
      groupConditionQuery: [null]
    });
  }


  createACLGROUPMAPPING() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const formData = this.formGroup.value;
    console.log(formData)
    this.AalGroupMappingService.createGroupMapping(formData).subscribe((result) => {
      console.warn(result, 'ACL created Successfully');
      this.alertService.success(`ACL has been created`);

      /*//insert kenga_group_id and user_id into table. This tracks users who belong to the group
      for(let i=0; i<formData.data_collectors.length; i++){
        const KengaUserGroupData = new FormData()
        KengaUserGroupData.append('kengaGroup', result.id)
        KengaUserGroupData.append('user', formData.data_collectors[i])

        this.groupsService.createKengaUserGroup(KengaUserGroupData).subscribe(data => {
          console.log(data ,"Kenga User Group details")
        }, error => {this.alertService.error("failed to create Kenga User Groups")})
      }*/

      this.router.navigate(['/home']);
    }, error => {
      this.alertService.error("Failed to Create the Group")
    });
  }

  /*goBack() {
    this.router.navigate(['/groups'])
  }*/

}
