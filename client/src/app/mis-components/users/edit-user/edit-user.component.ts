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
import {UsersService} from "../../../services/users.service";
import {AlertService} from "../../../services/alert";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  constructor(
    private userService: UsersService,
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
    this.userService.getUsers().subscribe((results: any) => {
      this.result= results[0]
      this.formGroup = this.formBuilder.group({
        password: [null],
        username: [this.result?.username, [Validators.required]],
        first_name: [this.result?.first_name, [Validators.required]],
        last_name: [this.result?.last_name, [Validators.required]],
        email: [this.result?.email, [Validators.required, Validators.email]],
        telephone: [this.result?.telephone, [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
        role: [this.result?.role],
        groups: [this.result?.groups],
        is_active: [this.result?.is_active],
        data_collector_Type: [this.result?.data_collector_Type],
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
            console.warn(result, 'System User has been deleted');
            this.alertService.warning(`User has been deleted`)
            this.router.navigate(['/ppdausers']);
          }, error => {
            this.alertService.error(`Failed to delete User: ${this.formGroup.controls.username.value}`)
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
    console.log(submitData)
    /*const formData = Object.keys(fData).filter(item => fData[item] != undefined || fData[item] != null);
    const submitData = {};
    formData.forEach(item => Object.assign(submitData, {[item]: fData[item]}));
    console.log(submitData);*/
    this.userService.updateUser(this.route.snapshot.params.id, submitData).subscribe((result) => {
      console.warn(result, 'System User Updated Successfully');
      this.alertService.success(`User: ${result.username} has been successfully updated`)
      this.router.navigate(['/ppdausers']);
    }, error => {
      this.alertService.error(`Failed to update User: ${this.formGroup.controls.username.value}`)
    });
  }

  /*private validateUsername():ValidatorFn {

      return (control: AbstractControl): ValidationErrors | null => {
          return this.userService.getUsers()
              .subscribe(data => {
                      this.DataUsername  = data.results.map(a=>a.username)
                      // console.log(this.DataUsername,"Usernames")

                      if (this.DataUsername.includes(control.value)) {
                          // alert("username is already used")
                          if(control.value!==null||control.value!=''){
                              console.log("username is already used");
                              return control.setErrors({'alreadyExist': true})
                          }
                      } else {
                          // console.log("username is fresh");
                          return null;
                      }
                  },
                  (error) => {
                      console.log(error);
                  }
              );
      }
  }
  private validateEmail(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
          return this.userService.getUsers()
              .subscribe(data => {
                      this.DataEmail  = data.results.map(a=>a.email)
                      // console.log(this.DataEmail,"Emails")

                      if (this.DataEmail.includes(control.value)) {
                          // alert("Email is already used")
                          // console.log("Email is already used");
                          return control.setErrors({'alreadyExist': true})
                          /!*if(control.value!=null||control.value!=''){
                              return control.setErrors({'alreadyExist': true})
                          }*!/

                      } else {
                          // console.log("Email is fresh");
                          return null;
                      }
                  },
                  (error) => {
                      console.log(error);
                  }
              );
      }
  }
  private validateTelephone(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
          return this.userService.getUsers()
              .subscribe(data => {
                      this.DataTelephone  = data.results.map(a=>a.telephone)
                      // console.log(this.DataTelephone,"Telephone")

                      if (this.DataTelephone.includes(control.value)) {
                          // alert("Telephone is already used")
                          // console.log("Telephone is already used");
                          return control.setErrors({'alreadyExist': true})
                          // if(control.value!=null||control.value!=''){
                          //     return control.setErrors({'alreadyExist': true})
                          // }
                      } else {
                          // console.log("Telephone is fresh");
                          return null;
                      }
                  },
                  (error) => {
                      console.log(error);
                  }
              );
      }
  }*/


}
