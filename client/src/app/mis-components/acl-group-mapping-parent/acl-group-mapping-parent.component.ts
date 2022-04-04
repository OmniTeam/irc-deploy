import {Component, OnChanges, OnInit} from '@angular/core';
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
  selector: 'app-acl-group-mapping-parent',
  templateUrl: './acl-group-mapping-parent.component.html',
  styleUrls: ['./acl-group-mapping-parent.component.scss']
})
export class AclGroupMappingParentComponent implements OnInit {

  constructor(
    private groupsService: GroupsService,
    private AalGroupMappingService: AclGroupMappingService,
    private formService: FormService,
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
  dataVariable = [
    {
      'name': "Trace Kenya",
    },
    {
      'name': "Young Domestic Worker (WOTESAWA)",
    },
    {
      'name': "Foundation integrated for Rural Development( FIRD)",
    },
    {
      'name': "Human Rights Democracy Link Africa (RIDE Africa)",
    },
  ]
  dataContext = [
    {
      'name': "central_user_name",
    },
    {
      'name': "submitterName",
    },
  ]
  operation = [
    {
      'sign': '=',
      'description':'EQUAL'
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
  addQueryButtonText="Add Query To Table"
  queryFormArray = []
  groupConditionQuery=''
  form:any
  editIndex = -1;
  isEditable = false
  formName: any
  i: any
  greyOutGroupField = false
  error=''

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.formService.getForms().subscribe(results => {
      this.forms = results
      const formsData = results
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
      permissions: [1],
      queryArray: this.formBuilder.array([]),
    });
  }

  getFormAndQuery(){
    return this.formBuilder.group({
      form: [this.form],
      groupConditionQuery: [this.groupConditionQuery],

    })
  }

  addQuery(){
    const control = <FormArray>this.formGroup.get('queryArray')
    if (this.editIndex === -1) {
      control.push(this.getFormAndQuery())
      this.form=''
      this.groupConditionQuery=''
    } else {
      control.at(this.editIndex).patchValue(this.getFormAndQuery());
      this.form=''
      this.groupConditionQuery=''
    }
    this.checkArray()
  }

  get queryArray() {
    return this.formGroup.get('queryArray').value;
  }

  deleteQuestion(i) {
    const control = <FormArray>this.formGroup.get('queryArray');
    control.removeAt(i);
    this.checkArray()
  }

  checkArray(){
    const arrayData = this.formGroup.get('queryArray').value
    this.greyOutGroupField = arrayData.length > 0;
  }

  createACLGROUPMAPPING() {
    const formData = this.formGroup.value;
    console.log(formData)
    this.AalGroupMappingService.createGroupMapping2(formData).subscribe((result) => {
      console.warn(result, 'ACL created Successfully');
      this.alertService.success(`ACL has been created`);
      this.router.navigate(['/home']);
    }, error => {
      this.alertService.error("Failed to Create the ACL")
    });
  }
}
