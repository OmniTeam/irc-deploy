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
import {UsernameValidator} from "../../../validators/username.validator";
import {GroupValidator} from "../../../validators/group.validator";


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  ACD: any;

  constructor(
    private groupsService: GroupsService,
    private usersService: UsersService,
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
  parents:any;
  programs:any;
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
  dataCollectors:any;

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.groupsService.getGroups().subscribe(data => {
      this.parents = data
      console.log(data)
    }, error => {
      this.alertService.error("Failed to get Parents")
    })
    this.usersService.getPrograms().subscribe(data => {
      this.programs = data
      console.log(data)
    }, error => {
      this.alertService.error("Failed to get Programs")
    })
    this.usersService.getUsers().subscribe(data => {
      this.dataCollectors = data
      console.log(this.dataCollectors)
    }, error => {
      this.alertService.error("Failed to get Data Collectors")
    })

    this.formGroup = this.formBuilder.group({
      name: ['',[Validators.required, GroupValidator.validateGroup(this.groupsService)]],
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

  // shows data collectors based on access to central data toggle
  changeCentralDataAccess() {
    this.ACD = this.f['access_to_central_data'].value
    console.log(this.ACD)
    if (this.ACD === true) {
      this.f['data_collectors'].reset()
      document.getElementById('data_collectors').hidden = false
    } else {
      this.f['data_collectors'].reset()
      document.getElementById('data_collectors').hidden = true
    }


  }

  goBack() {
    this.router.navigate(['/groups'])
  }


}
