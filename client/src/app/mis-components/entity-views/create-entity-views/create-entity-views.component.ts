import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EntityService} from "../../../services/entity.service";
import {Subject} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpParams} from "@angular/common/http";
import {AlertService} from "../../../services/alert";

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
  entries: number = 10;
  selected: any[] = [];
  activeRow: any;
  rows: Object[];
  formData: any;
  formDataField: any;
  submitted = false;
  submitFields = false;
  entityRecord: any;
  editing = {};
  fieldTypes = [
    {'name': "Display Field", 'value': "Display Field"},
    {'name': "Filter Field", 'value': "Filter Field"},
    {'name': "Key Field", 'value': "Key Field"},
    {'name': "Other", 'value': "Other"}
  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private entityService: EntityService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entityId = params.id;
    });
    const params = new HttpParams()
      .set('id', this.entityId);
    this.entityService.getCurrentEntity(this.entityId).subscribe((data) => {
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
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value;
    this.rows = this.rows.filter(function (d) {
      for (let key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
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
        this.alertService.success(`New Entity View has been successfully created `);
        this.router.navigate(['/entityView']);
      }, error => {
        this.alertService.error(`Entity View has not been successfully created `);
      });
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

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    this.formData = this.rows[rowIndex];
  }

  deleteField(deletedRow) {
    this.rows = this.removeElementFormArray(this.rows, deletedRow.name);
    this.rows = [...this.rows];

    let entityViewFieldId = deletedRow.id;
    this.entityService.deleteEntityViewField(entityViewFieldId).subscribe((result) => {
        this.alertService.warning(`Entity View Field has been  deleted `);
      }, error => {
        this.alertService.error(`Entity View Field could not be deleted`);
      }
    );
  }

  onReset() {
    this.formGroup.reset();
    this.formGroupField.reset();
  }

  removeElementFormArray(array, rowName) {
    return array.filter(function(element){
      return element.name != rowName;
    });
  }

}
