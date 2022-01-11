import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EntityService} from "../../../services/entity.service";
import {Subject} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-create-entity-views',
  templateUrl: './create-entity-views.component.html',
  styleUrls: ['./create-entity-views.component.css']
})
export class CreateEntityViewsComponent implements OnInit {

  formGroup: FormGroup;
  formGroupField: FormGroup;
  entityName = "";
  entityId = "";
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  formData: any;
  formDataField: any;
  submitted = false;
  submitFields = false;
  entityRecord: any;
  rows = [];
  fieldTypes = [
    {'name': "Display Field", 'value': "Display Field"},
    {'name': "Filter Field", 'value': "Filter Field"},
    {'name': "Key Field", 'value': "Key Field"},
    {'name': "Other", 'value': "Other"}
  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private entityService: EntityService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entityId = params.id;
    });
    const params = new HttpParams()
      .set('id', this.entityId);
    this.entityService.getEntityRecord(params).subscribe((data) => {
      this.entityRecord = data;
    }, error => console.log(error));

    this.formGroupField = this.formBuilder.group({
      name: ['', [Validators.required]],
      fieldType: ['', [Validators.required]],
      orderOfDisplay: ['', [Validators.required]],
      filterOrder: ['', [Validators.required]],
    })

    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      tableName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      viewQuery: ['', [Validators.required]],
    });
    this.rows = [];
    this.dtOptions = {
      pagingType: "numbers",
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      processing: true,
      responsive: true,
      dom: 'lfrtip'
    };
  }

  createEntityView() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    } else {
      this.formData = this.formGroup.value;
      let entityViewFields = {"viewFields": this.rows};
      let entity = {"misEntity": this.entityRecord};
      this.formData = Object.assign(this.formData, entityViewFields);
      this.formData = Object.assign(this.formData, entity);
      this.entityService.createEntityView(this.formData).subscribe((data) => {
        this.router.navigate(['/entityView']);
      }, error => console.log(error));
    }
  }

  addNewEntityField() {
    this.submitFields = true;
    if (this.formGroupField.invalid) {
      return;
    } else {
      this.formDataField = this.formGroupField.value;
      let dataType = 'Text';
      this.formDataField = Object.assign(this.formDataField, {"datatype": dataType});
      this.rows.push(this.formDataField);
      this.rows = [...this.rows];

    }

    if (this.formGroupField.valid) {
      setTimeout(() => {
        this.formGroupField.reset();
        this.submitFields = false;
      }, 100);
    }
  }

  get f() {
    return this.formGroup.controls;
  }

  get fFields() {
    return this.formGroupField.controls;
  }

  onReset(){
    this.formGroup.reset();
    this.formGroupField.reset();
  }

}
