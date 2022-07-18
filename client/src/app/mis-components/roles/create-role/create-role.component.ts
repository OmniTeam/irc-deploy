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
import {GroupsService} from '../../../services/groups.service';
import {RolesService} from '../../../services/roles.service';


@Component({
  selector: 'app-create-group',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit {

  constructor(
    private rolesService: RolesService,
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
  formData: any;
  submitted = false;

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      authority: ['', [Validators.required]],
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
    console.log(this.formGroup.getRawValue());
    this.rolesService.createRole(formData).subscribe((result) => {
        console.warn(result, 'Role created Successfully');
        this.alertService.success(`Role: ${this.formGroup.controls.authority.value} has been created`);
        this.router.navigate(['/roles']);
    }, error => {this.alertService.error('Failed to Create the Role'); });
  }

  resetForm() {
    this.formGroup.reset();
    this.clicked = false;
    this.submitted = false;
  }

}
