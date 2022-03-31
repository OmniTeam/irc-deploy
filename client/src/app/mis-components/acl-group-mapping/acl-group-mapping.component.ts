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
      'permission': 1,
      'name': 'READ'
    },
    {
      'permission': 2,
      'name': 'WRITE'
    },
    {
      'permission': 4,
      'name': 'CREATE'
    },
    {
      'permission': 8,
      'name': 'DELETE'
    },
    {
      'permission': 16,
      'name': 'ADMIN'
    },
  ]
  operation = [
    {
      'sign': '=',
      'description':'EQUAL'
    },
    {
      'sign': '>',
      'description':'GREATER THAN'
    },
    {
      'sign': '<',
      'description':'LESS THAN'
    },
    {
      'sign': '>=',
      'description':'GREATER THAN OR EQUAL'
    },
    {
      'sign': '<=',
      'description':'LESS THAN OR EQUAL'
    },
    {
      'sign': '<>',
      'description':'NOT EQUAL'
    },
    {
      'sign': 'BETWEEN',
      'description':'BETWEEN'
    },
    {
      'sign': 'LIKE',
      'description':'SEARCH A PATTERN'
    },
    {
      'sign': 'IN',
      'description':'MULTIPLE POSSIBLE VALUES IN'
    },
  ]
  forms: any

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.formsService.getForms().subscribe(results => {
      this.forms = results
    }, error => {
      this.alertService.error("Failed to get Forms")
    })
    this.groupsService.getGroups().subscribe(results => {
      this.parents = results
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
      this.router.navigate(['/home']);
    }, error => {
      this.alertService.error("Failed to Create the Group")
    });
  }
}
