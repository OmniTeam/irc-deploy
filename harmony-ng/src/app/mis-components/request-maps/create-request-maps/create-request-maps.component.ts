import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {RequestMapsService} from "../../../services/request-maps.service";

@Component({
  selector: 'app-create-request-maps',
  templateUrl: './create-request-maps.component.html',
  styleUrls: ['./create-request-maps.component.css']
})
export class CreateRequestMapsComponent implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  formData: any;
  httpMethods = [];

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private requestMapsService: RequestMapsService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      url: ['', [Validators.required]],
      configAttribute: ['', [Validators.required]],
      httpMethod: [''],
    });
    this.requestMapsService.getHttpMethods().subscribe((data) => {
      this.httpMethods = data;
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  createRequestMap() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const requestMap = this.formGroup.value;
    this.requestMapsService.createRequestMaps(requestMap).subscribe(results => {
      this.router.navigate(['/requestMaps']);
      this.alertService.success(`Request Map has been successfully created `);
    }, error => {
      this.alertService.error(`Request Map could not be created`);
    });

    if (this.formGroup.valid) {
      setTimeout(() => {
        this.formGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  onReset() {
    this.formGroup.reset();
  }

}
