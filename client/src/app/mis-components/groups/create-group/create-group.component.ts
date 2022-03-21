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
  ACD: boolean;

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
  parents: any
  permissions = [
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
  dataCollectors: any

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(results => {
      this.dataCollectors = results
      console.log(results)
    }, error => {
      this.alertService.error("Failed to get data collectors")
    })
    this.groupsService.getGroups().subscribe(results => {
      this.parents = results
      console.log(results)
    }, error => {
      this.alertService.error("Failed to get parents")
    })
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
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

      console.log(formData.data_collectors, "Data Collectors")

      //insert kenga_group_id and user_id into table. This tracks users who belong to the group
      for(let i=0; i<formData.data_collectors.length; i++){
        const KengaUserGroupData = new FormData()
        KengaUserGroupData.append('kengaGroup', result.id)
        KengaUserGroupData.append('user', formData.data_collectors[i])

        this.groupsService.createKengaUserGroup(KengaUserGroupData).subscribe(data => {
          console.log(data ,"Kenga User Group details")
        }, error => {this.alertService.error("failed to create Kenga User Groups")})
      }

      this.router.navigate(['/groups']);
    }, error => {
      this.alertService.error("Failed to Create the Group")
    });
  }

  // shows data collectors based on access to central data toggle
  changeCentralDataAccess() {
    this.ACD = this.f['access_to_central_data'].value
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
