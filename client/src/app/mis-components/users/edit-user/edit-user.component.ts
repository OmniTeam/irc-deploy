import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '../../../services/users.service';
import {AlertService} from '../../../services/alert';
import {AuthService} from '../../../services/auth.service';
import {RolesService} from '../../../services/roles.service';
import {GroupsService} from '../../../services/groups.service';
import {HttpParams} from '@angular/common/http';
import {ProgramPartnersService} from '../../../services/program-partners.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user_Type: any;
  userTypeValue: any;
  partnerUserRolesIdsArray: any;
  staffUserRolesIdsArray: any;

  constructor(
    private userService: UsersService,
    private groupsService: GroupsService,
    private rolesService: RolesService,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private programPartnersService: ProgramPartnersService,
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
  partners: any;
  data_collector_Type = [
    {
      'name': 'Enumerator'
    },
    {
      'name': 'Field Staff'
    }
  ];
  userTypeFilled: any;
  type_of_user = [
    {
      'name': 'Partner'
    },
    {
      'name': 'CRVPF Staff'
    }
  ];
  groups: any;
  staffUserRoles: any;
  partnerUserRoles: any;
  partnerRolesArray = ['ROLE_PARTNER_DATA_VIEWER', 'ROLE_PARTNER_DATA_MANAGER'];
  staffRolesArray = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_DATA_COLLECTOR', 'ROLE_APPLICANT',
    'ROLE_PARTNER_DATA_VIEWER', 'ROLE_PARTNER_DATA_MANAGER'];

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.rolesService.getRoles().subscribe( data => {
      this.user_Type = data;
      this.partnerUserRoles = data.filter(a => ['ROLE_PARTNER_DATA_VIEWER', 'ROLE_PARTNER_DATA_MANAGER'].includes(a.authority) );
      this.partnerUserRolesIdsArray = this.partnerUserRoles.map(a => a.id);
      this.staffUserRoles = data.filter(a => a.authority.includes('Staff') ||
        !['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_DATA_COLLECTOR', 'ROLE_APPLICANT',
          'ROLE_PARTNER_DATA_VIEWER', 'ROLE_PARTNER_DATA_MANAGER'].includes(a.authority) );
      this.staffUserRolesIdsArray = this.staffUserRoles.map(a => a.id);
      console.log(this.partnerUserRoles);
    }, error => {this.alertService.error('Failed to get Roles'); });
    this.groupsService.getGroups().subscribe( result => {
      this.groups = result;
      console.log(result);
    }, error => {this.alertService.error('Failed to get Groups'); });
    this.programPartnersService.getProgramPartners().subscribe((data) => {
      this.partners = data;
    });

    this.userService.getCurrentUser(this.route.snapshot.params.id).subscribe((results: any) => {
      console.log('user', results);
      this.formGroup = this.formBuilder.group({
        username: [results?.username, [Validators.required]],
        names: [results?.names, [Validators.required]],
        email: [results?.email/*, [Validators.required, Validators.email]*/],
        password: [results?.password],
        role: [results?.role],
        partner: [results?.partner],
        groups: [results?.groups],
        enabled: [results?.enabled],
      });
    });
  }

  /*ngAfterInit(): void {
    console.log(this.formGroup.controls['role'].value, 'role of user');
    console.log(this.partnerUserRolesIdsArray, 'partner array to compare user');
    console.log(this.staffUserRolesIdsArray, 'staff array to compare user');
    if (this.partnerUserRolesIdsArray.includes((this.formGroup.controls['role'].value)).toString()) {
      console.log('partner section');
      document.getElementById('role_partner').hidden = false;
      (<HTMLInputElement>document.getElementById('user_type')).value = 'Partner';

    } else if (this.staffUserRolesIdsArray.includes((this.formGroup.controls['role'].value)).toString()) {
      console.log('staff section');
      document.getElementById('role_staff').hidden = false;
      (<HTMLInputElement>document.getElementById('user_type')).value = 'CRVPF Staff';
    }
  }*/

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  userType(event) {
    this.userTypeValue = event;
    if (event === 'Partner') {
      this.formGroup.controls['role'].reset();
      document.getElementById('role_partner').hidden = false;
      document.getElementById('role_staff').hidden = true;
    } else if (event === 'CRVPF Staff') {
      this.formGroup.controls['role'].reset();
      document.getElementById('role_staff').hidden = false;
      document.getElementById('role_partner').hidden = true;
    }


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
    console.log('submitData', submitData);
    const params = new HttpParams()
      .set('role', submitData.role)
      .set('groups', submitData.groups)
      .set('partner', submitData.partner ?? '');
    this.userService.updateUser(this.route.snapshot.params.id, submitData, params).subscribe((result) => {
      console.log(result, 'System User Updated Successfully');
      this.alertService.success(`User: ${result.username} has been successfully updated`);
      this.router.navigate(['/users']);
    }, error => {
      this.alertService.error(`Failed to update User: ${this.formGroup.controls.username.value}`);
    });
  }


}
