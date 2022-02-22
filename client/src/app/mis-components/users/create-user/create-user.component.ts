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


@Component({
  selector: 'app-createppdauser',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  private DataEmail: any;
  private DataTelephone: any;
  private DataUsername: any;

  constructor(
    private userService: UsersService,
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
  fieldTextType: boolean;
  sex = [
    {
      'name': 'Male'
    },
    {
      'name': 'Female'
    }
  ];
  user_Type = [
    {
      'name': 'Data Manager'
    },
    {
      'name': 'Data Viewer'
    },
    {
      'name': 'Data Collector'
    },
  ];
  data_collector_Type = [
    {
      'name': 'Enumerator'
    },
    {
      'name': 'Field Staff'
    }
  ];
  groups = [
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

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      username: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      role: [null],
      groups: [null],
      is_active: [true],
      data_collector_Type: [null],
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
    console.log(this.formGroup.getRawValue())
    this.userService.createUser(formData).subscribe((result) => {
        console.warn(result, 'User created Successfully');
        this.alertService.success(`Name of user is: ${result.first_name} ${result.last_name}, Username is: ${result.username} and Password is: ${this.formGroup.controls.password.value}`);
        this.router.navigate(['/users']);
    },error => {this.alertService.error("Failed to Create the User")});
  }

  resetForm() {
    this.formGroup.reset();
  }

}
