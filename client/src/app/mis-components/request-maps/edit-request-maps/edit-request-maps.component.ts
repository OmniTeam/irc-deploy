import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {RequestMapsService} from "../../../services/request-maps.service";

@Component({
  selector: 'app-edit-request-maps',
  templateUrl: './edit-request-maps.component.html',
  styleUrls: ['./edit-request-maps.component.css']
})
export class EditRequestMapsComponent implements OnInit {

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  httpMethods = [];
  requestMapId: any;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private requestMapsService: RequestMapsService) { }

  ngOnInit(): void {
    this.requestMapId = this.route.snapshot.params.id
    this.requestMapsService.getCurrentRequestMap(this.requestMapId).subscribe((results: any) => {
      this.formGroup = this.formBuilder.group({
        url: [results?.url, [Validators.required]],
        configAttribute: [results?.configAttribute, [Validators.required]],
        httpMethod: [results?.httpMethod]
      });
    });
    this.requestMapsService.getHttpMethods().subscribe((data) => {
      this.httpMethods = data;
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  editRequestMap() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const requestMap = this.formGroup.value;
    this.requestMapsService.updateRequestMaps(this.requestMapId, requestMap).subscribe(results => {
      this.router.navigate(['/requestMaps']);
      this.alertService.success(`Request Map has been successfully updated `);
    }, error => {
      this.alertService.error(`Request Map could not be updated`);
    });

    if (this.formGroup.valid) {
      setTimeout(() => {
        this.formGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  cancel(): void {
    window.history.back();
  }

}
