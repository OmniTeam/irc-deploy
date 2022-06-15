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
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '../../../services/users.service';
import {AlertService} from '../../../services/alert';
import {AuthService} from '../../../services/auth.service';
import {RolesService} from '../../../services/roles.service';
import {GroupsService} from '../../../services/groups.service';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user_Type: any;

  constructor(
    private userService: UsersService,
    private groupsService: GroupsService,
    private rolesService: RolesService,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  clicked = false;
  result: any;
  formGroup: FormGroup;
  formData: any;
  deactivate = false;
  submitted = false;
  fieldTextType: boolean;
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
    this.groupsService.getGroups().subscribe( result => {
      this.groups = result;
    }, error => {this.alertService.error('Failed to get Groups'); });
    this.userService.getCurrentUser(this.route.snapshot.params.id).subscribe((results: any) => {
      console.log(results);
      this.formGroup = this.formBuilder.group({
        password: [results?.password, [Validators.required]],
        username: [results?.username, [Validators.required]],
        names: [results?.names, [Validators.required]],
        email: [results?.email/*, [Validators.required, Validators.email]*/],
        designation: [results?.designation],
        role: [results?.role],
        groups: [results?.groups],
        enabled: [results?.enabled],
        data_collector_Type: [results?.data_collector_Type],
      });
    });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  deleteUser() {
    if (confirm('Are you sure to delete this System user?')) {
      console.log(
        this.userService.deleteCurrentUser(this.route.snapshot.params.id).subscribe((result) => {
            console.warn(result, 'User has been deleted');
            this.alertService.warning(`User has been deleted`);
            this.router.navigate(['/users']);
          }, error => {
            this.alertService.error(`Failed to delete User`);
          }
        ));
    }
  }

  updateUser() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const submitData = this.formGroup.value;
    console.log(submitData, 'submitData');
    const params = new HttpParams()
      .set('role', submitData.role)
      .set('groups', submitData.groups);
    this.userService.updateUser(this.route.snapshot.params.id, submitData, params).subscribe((result) => {
      console.warn(result, 'System User Updated Successfully');
      this.alertService.success(`User: ${result.username} has been successfully updated`);
      this.router.navigate(['/users']);
    }, error => {
      this.alertService.error(`Failed to update User: ${this.formGroup.controls.username.value}`);
    });
  }


}
