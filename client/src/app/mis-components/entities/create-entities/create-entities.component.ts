import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {EntityService} from "../../../services/entity.service";
import {AlertService} from "../../../services/alert";

@Component({
  selector: 'app-create-entities',
  templateUrl: './create-entities.component.html',
  styleUrls: ['./create-entities.component.css']
})
export class CreateEntitiesComponent implements OnInit {

  formGroup: FormGroup;
  formGroupField: FormGroup;
  submitted = false;
  submitFields = false;
  formData: any;
  formDataField: any;
  dataTypes = [
    {'name': "String", 'value': "String"},
    {'name': "Number", 'value': "Number"},
    {'name': "Date", 'value': "Date"},
    {'name': "Float", 'value': "Float"},
    {'name': "Boolean", 'value': "Boolean"},
  ];
  fieldTypes = [
    {'name': "Display Field", 'value': "Display Field"},
    {'name': "Filter Field", 'value': "Filter Field"},
    {'name': "Key Field", 'value': "Key Field"},
    {'name': "Other", 'value': "Other"}
  ];
  entries: number = 10;
  selected: any[] = [];
  activeRow: any;
  rows: Object[];
  enableButtons: true;
  editing = {};

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

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private entityService: EntityService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.formGroupField = this.formBuilder.group({
      displayName: ['', [Validators.required]],
      dataType: ['', [Validators.required]],
      mandatory: ['Yes', [Validators.required]],
      fieldType: ['', [Validators.required]],
      orderOfDisplay: [1, [Validators.required]],
    })
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      prefix: ['', [Validators.required]],
      enableTagging: [false, [Validators.required]],
    });
    this.rows = [];
  }

  get f() {
    return this.formGroup.controls;
  }

  get fFields() {
    return this.formGroupField.controls;
  }

  createEntity() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    } else {
      this.formData = this.formGroup.value;
      let entityName = this.formData.name;
      let codeField = {};
      codeField['displayName'] = 'Code';
      codeField['fieldName'] = '_code';
      codeField['fieldType'] = 'Key Field';
      codeField['dataType'] = 'String';
      codeField['sqlDataType'] = 'text';
      codeField['mandatory'] = 'Yes';

      // Add Tag Field is its enabled
      if (this.formData.enableTagging === true) {
        let tagField = {};
        tagField['displayName'] = 'Tag';
        tagField['fieldName'] = '_tag';
        tagField['fieldType'] = 'Tag Field';
        tagField['dataType'] = 'String';
        tagField['sqlDataType'] = 'text';
        tagField['mandatory'] = 'No';
        tagField['orderOfDisplay'] = 100;
        this.rows.push(tagField);
        let entityTagTable = {"entityTagTable": this.generateEntityTagTableName(entityName)};
        this.formData = Object.assign(this.formData, entityTagTable);
      }
      this.rows.push(codeField);

      let entityFields = {"entityFields": this.rows};
      let tableName = {"tableName": this.generateEntityTableName(entityName)};
      let prefixIncrementTable = {"prefixIncrementTable": this.generateEntityPrefixIncrementTableName(entityName)};
      this.formData = Object.assign(this.formData, entityFields);
      this.formData = Object.assign(this.formData, tableName);
      this.formData = Object.assign(this.formData, prefixIncrementTable);
      this.entityService.createEntity(this.formData).subscribe((data) => {
        this.alertService.success(`Entity record has been created successfully`);
        this.router.navigate(['/entity']);
      }, error => {
        this.alertService.error(`Entity record has not been successfully created`);
      });
    }
  }

  addField() {
    this.submitFields = true;
    if (this.formGroupField.invalid) {
      return;
    } else {
      this.formDataField = this.formGroupField.value;
      let displayName = this.formDataField.displayName;
      let dataType = this.formDataField.dataType;
      let fieldName = this.generateFieldName(displayName);
      let sqlDataType = this.generateSqlDataType(dataType);
      this.formDataField = Object.assign(this.formDataField, {"sqlDataType": sqlDataType});
      this.formDataField = Object.assign(this.formDataField, {"fieldName": fieldName});
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

  editField() {

  }

  deleteField(deletedRow) {
    this.rows = this.removeElementFormArray(this.rows, deletedRow.fieldName);
    this.rows = [...this.rows];
  }

  generateEntityTableName(entityName: string): string {
    return 'entity_' + this.replaceAll(entityName.toLowerCase(), ' ', '_');
  }

  generateEntityPrefixIncrementTableName(entityName: string): string {
    return 'entity_' + this.replaceAll(entityName.toLowerCase(), ' ', '_') + '_prefix_increment';
  }

  generateEntityTagTableName(entityName: string): string {
    return 'entity_' + this.replaceAll(entityName.toLowerCase(), ' ', '_') + '_tagging';
  }

  generateSqlDataType(dataType: string): string {
    let sqlDataType;
    if (dataType === "String") {
      sqlDataType = "text";
    } else if (dataType === "Date") {
      sqlDataType = "datetime";
    } else if (dataType === "Number") {
      sqlDataType = "int";
    } else if (dataType === "Float") {
      sqlDataType = "double";
    } else if (dataType === "Boolean") {
      sqlDataType = "bit";
    } else {
      sqlDataType = "varchar(255)";
    }
    return sqlDataType;
  }

  generateFieldName(displayName: string): string {
    return '_' + this.replaceAll(displayName.toLowerCase(), ' ', '_');
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    this.formData = this.rows[rowIndex];
  }

  onReset() {
    this.formGroup.reset();
    this.formGroupField.reset();
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  removeElementFormArray(array, rowName) {
    return array.filter(function(element){
      return element.fieldName != rowName;
    });
  }

}
