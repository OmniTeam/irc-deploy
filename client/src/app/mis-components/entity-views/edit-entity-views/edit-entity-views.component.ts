import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EntityService} from "../../../services/entity.service";
import {AlertService} from "../../../services/alert";

@Component({
  selector: 'app-edit-entity-views',
  templateUrl: './edit-entity-views.component.html',
  styleUrls: ['./edit-entity-views.component.css']
})
export class EditEntityViewsComponent implements OnInit {

  formGroup: FormGroup;
  formGroupField: FormGroup;
  entityName = "";
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
  entityViewId: any;
  entityId: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private entityService: EntityService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entityViewId = params.id;
      this.entityId = params.entityId;
    });

    this.entityService.getCurrentEntity(this.entityId).subscribe((data) => {
      this.entityRecord = data;
    }, error => console.log(error));

    this.entityService.getCurrentEntityView(this.entityViewId).subscribe((results: any) => {
      let entityViewInfo = results['entityView'];
      let entityViewFieldsInfo = results['entityViewFields'];
      this.formGroup = this.formBuilder.group({
        name: [entityViewInfo?.name, [Validators.required]],
        tableName: [entityViewInfo?.tableName, [Validators.required]],
        description: [entityViewInfo?.description, [Validators.required]],
        viewQuery: [entityViewInfo?.viewQuery, [Validators.required]],
      });
      this.rows = entityViewFieldsInfo;
    });
    this.formGroupField = this.formBuilder.group({
      name: ['', [Validators.required]],
      fieldType: ['', [Validators.required]],
      orderOfDisplay: ['', [Validators.required]],
      filterOrder: ['', [Validators.required]],
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  get fFields() {
    return this.formGroupField.controls;
  }

  editEntityView() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    } else {
      this.formData = this.formGroup.value;
      let entityViewFields = {"viewFields": this.rows};
      let entity = {"misEntity": this.entityRecord};
      this.formData = Object.assign(this.formData, entityViewFields);
      this.formData = Object.assign(this.formData, entity);
      this.entityService.updateEntityView(this.entityViewId, this.formData).subscribe(results => {
        this.router.navigate(['/entityView']);
        this.alertService.error(`${this.formData.name} has been successfully updated`);
      }, error => {
        this.alertService.error(`${this.formData.name} could not be updated`);
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

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    this.formData = this.rows[rowIndex];
  }

  deleteField(deletedRow) {
    this.rows = this.removeElementFormArray(this.rows, deletedRow.name);
    this.rows = [...this.rows];
  }

  removeElementFormArray(array, rowName) {
    return array.filter(function (element) {
      return element.name != rowName;
    });
  }

  cancel(): void {
    window.history.back();
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
}
