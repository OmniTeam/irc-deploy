import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {EntityViewFiltersService} from "../../../services/entity-view-filters.service";

@Component({
  selector: 'app-edit-entity-view-filters',
  templateUrl: './edit-entity-view-filters.component.html',
  styleUrls: ['./edit-entity-view-filters.component.css']
})
export class EditEntityViewFiltersComponent implements OnInit {

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  entityViewId: any;
  entityViewFilterId: any;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private entityViewFiltersService: EntityViewFiltersService) { }

  ngOnInit(): void {
    this.entityViewFilterId = this.route.snapshot.params.id;
    this.entityViewId = this.route.snapshot.params.entityViewId;
    this.entityViewFiltersService.getCurrentEntityViewFilter(this.entityViewFilterId).subscribe((results: any) => {
      this.formGroup = this.formBuilder.group({
        name: [results?.name, [Validators.required]],
        description: [results?.description],
        filterQuery: [results?.filterQuery]
      });
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  editEntityViewFilter() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    this.formData = this.formGroup.value;
    let entityView = {"entityView": this.entityViewId};
    this.formData = Object.assign(this.formData, entityView);
    this.entityViewFiltersService.updateEntityViewFilter(this.entityViewFilterId, this.formData).subscribe(results => {
      this.router.navigate(['/entityViewFilter']);
      this.alertService.success(`${this.formData.name} has been successfully updated `);
    }, error => {
      this.alertService.error(`${this.formData.name} could not be updated`);
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
