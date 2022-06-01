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
import {UsersService} from '../../../services/users.service';
import {TagService} from '../../../services/tags';
import {AlertService} from '../../../services/alert';
import {UsernameValidator} from '../../../validators/username.validator';
import {RolesService} from '../../../services/roles.service';
import {GroupsService} from '../../../services/groups.service';


@Component({
  selector: 'app-createppdauser',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  constructor(
    private userService: UsersService,
    private rolesService: RolesService,
    private groupsService: GroupsService,
    private tagsService: TagService,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  clicked = false;
  currentDashboards: any;
  formGroup: FormGroup;
  submitted = false;
  fieldTextType: boolean;
  sex = [
    {
      'name': 'Male'
    },
    {
      'name': 'Female'
    }
  ];
  // represents the user roles
  user_Type: any;
  data_collector_Type = [
    {
      'name': 'Enumerator'
    },
    {
      'name': 'Field Staff'
    }
  ];
  groups: any;

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.rolesService.getRoles().subscribe( data => {
      this.user_Type = data;
    }, error => {this.alertService.error('Failed to get Roles'); });
    this.groupsService.getGroups().subscribe( data => {
      this.groups = data;
    }, error => {this.alertService.error('Failed to get Groups'); });
    this.formGroup = this.formBuilder.group({
      password: ['', [Validators.required]],
      username: ['', [Validators.required, UsernameValidator.validateUsername(this.userService)]],
      names: ['', [Validators.required]],
      email: [''/*, [Validators.required, Validators.email]*/],
      designation: [''],
      role: [null],
      groups: [null],
      enabled: [true],
      data_collector_Type: [],
    });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  createUser() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
     const formData = this.formGroup.value;
    console.log(formData, 'data');
    this.userService.createUser(formData).subscribe((result) => {
        this.alertService.success(`User is created successfully`);
      // console.log(formData.kengaGroup, 'Groups');
      console.log(formData.role, 'Role');

      formData.role.forEach((role) => {
        // insert the user's role in the user role table
        const userRoleData = new FormData();
        userRoleData.append('user', result.id);
        userRoleData.append('role', role);

        this.userService.createUserRole(userRoleData).subscribe(data => {
          console.log(data, 'User Role');
        }, error => {this.alertService.error('failed to create user role'); });
      });

      // inserts user_id group_id pairs into the user group table
        const userGroupData = new FormData()
        userGroupData.append('user', result.id)
        userGroupData.append('group', formData.groups)

        this.userService.createUserGroup(userGroupData).subscribe(data => {
          console.log(data ,"User group")
        }, error => {this.alertService.error("failed to create user groups")})

        this.router.navigate(['/users']);
    }, error => {this.alertService.error('Failed to Create the User'); });
  }

  resetForm() {
    this.formGroup.reset();
    this.clicked =  false;
    this.submitted = false;
  }

}
