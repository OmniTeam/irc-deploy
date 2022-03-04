import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {EntityViewFiltersService} from "../../../services/entity-view-filters.service";

@Component({
  selector: 'app-create-entity-view-filters',
  templateUrl: './create-entity-view-filters.component.html',
  styleUrls: ['./create-entity-view-filters.component.css']
})
export class CreateEntityViewFiltersComponent implements OnInit {

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  entityViewId: any;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private entityViewFiltersService: EntityViewFiltersService) { }

  ngOnInit(): void {
    this.entityViewId = this.route.snapshot.params.id;
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      filterQuery: ['']
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  createEntityViewFilter() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    this.formData = this.formGroup.value;
    let entityView = {"entityView": this.entityViewId};
    this.formData = Object.assign(this.formData, entityView);
    this.entityViewFiltersService.createEntityViewFilter(this.formData).subscribe(results => {
      this.router.navigate(['/entityViewFilter']);
      this.alertService.success(`${this.formData.name} has been successfully created `);
    }, error => {
      this.alertService.error(`${this.formData.name} could not be created`);
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
