import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './util.css']
})
export class LoginComponent implements OnInit {

  wrongCredentials: boolean = false;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  showSpinner = false;
  fieldTextType: boolean;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  login() {
    this.submitted = true;
    this.wrongCredentials = false;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;

    this.authService.login(
      {
        username: this.f.username.value,
        password: this.f.password.value
      }
    )
      .subscribe(success => {
        if (success) {
          this.wrongCredentials = false;
          this.router.navigate(['/']).then(() =>
            window.location.reload()
          );
          // this.authService.isUserLoggedIn.next(true);
          this.authService.getUserPartners();
        }
      }, error => {
        this.wrongCredentials = true
        console.log(error.status);
      });
  }
}
