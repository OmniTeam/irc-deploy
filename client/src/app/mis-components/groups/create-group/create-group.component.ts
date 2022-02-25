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
import {AuthService} from '../../../services/auth.service';
import {UsersService} from "../../../services/users.service";
import {TagService} from "../../../services/tags";
import {AlertService} from "../../../services/alert";
import {GroupsService} from "../../../services/groups.service";


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  constructor(
    private groupsService: GroupsService,
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
  data_collector_Type = [
    {
      'name': 'Enumerator'
    },
    {
      'name': 'Field Staff'
    }
  ];
  parents = [
    {
      name: "Partner 4",
    },
    {
      name: "Partner 1",
    },
    {
      name: "Uganda",
    },
    {
      name: "CRVP-Staff",
    },
  ]
  permissions =[
    {
      'name': 'Data Tables'
    },
    {
      'name': 'Task List'
    },
    {
      'name': 'Reports'
    },
  ]
  dataCollectors =[
    {
      'name': 'Okello Marvin'
    },
    {
      'name': 'Lewis Hamilton'
    },
    {
      'name': 'Pierre Gasly'
    },
  ]

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['',[Validators.required]],
      parent: [null],
      access_to_central_data: [false],
      permissions: [null],
      data_collectors: [null]
    });
  }


  createGroup() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const formData = this.formGroup.value;
    console.log(formData)
    this.groupsService.createGroup(formData).subscribe((result) => {
        console.warn(result, 'Group created Successfully');
        this.alertService.success(`Group has been created`);
        this.router.navigate(['/groups']);
    },error => {this.alertService.error("Failed to Create the Group")});
  }

  resetForm() {
    this.formGroup.reset();
    this.clicked = false
    this.submitted = false
  }

}
