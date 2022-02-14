import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SelectionType} from '@swimlane/ngx-datatable';
import {HttpParams} from "@angular/common/http";
import {EntityService} from "../../../services/entity.service";
import {ReplacePipe} from "../../../replace-pipe";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-entity-tables',
  templateUrl: './entity-tables.component.html',
  styleUrls: ['./entity-tables.component.css']
})
export class EntityTablesComponent implements OnInit {

  entityName = "";
  entries = 5;
  selected: any[] = [];
  activeRow: any;
  rows: Object[];
  columns: any;
  entityId = "";
  SelectionType = SelectionType;
  closeModal: string;
  formInputConfigs: any;
  formGroup: FormGroup;
  submitted = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private entityService: EntityService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder) {
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable($event) {
    const val = $event.target.value;
    this.rows = this.rows.filter(function (d) {
      for (const key in d) {
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

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entityId = params.id;
      this.getEntityData();
    });
  }

  getEntityData() {
    const params = new HttpParams()
      .set('id', this.entityId);
    this.entityService.getEntityData(params).subscribe((data) => {
      this.entityName = new ReplacePipe().transform(data.entity['name'], '_', ' ');
      this.rows = data.resultList;
      this.columns = this.columnMappings(data.headerList);
      this.formInputConfigs = this.generateFormInputConfigs(data.headerList);
    }, error => console.log(error));
  }

  columnMappings(array) {
    const columns = [];
    for (const column of array) {
      const columnProperties = {};
      columnProperties['prop'] = column['fieldName'];
      columnProperties['name'] = column['displayName'];
      columns.push(columnProperties);
    }
    return columns;
  }

  openFormModal(modalDom) {
    this.modalService.open(modalDom, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeModal = `Closed with: ${result}`;
    }, (reason) => {
      this.closeModal = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteRecord() {
  }

  exportToExcel() {
  }

  addNewEntityRecord() {
    const params = new HttpParams()
      .set('id', this.entityId);

    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }

    const newEntityRecord = this.formGroup.value;
    this.entityService.addNewEntityRecord(newEntityRecord, params).subscribe((data) => {
      window.location.reload();
    }, error => { console.log(error)})
  }

  generateFormInputConfigs(questions: any) {
    const configs = [];
    const controlsConfig = {}
    for (const question of questions) {
      const inputProperties = {};
      inputProperties['label'] = question['displayName'];
      inputProperties['type'] = this.getInputType(question['dataType']);
      inputProperties['controlName'] = question['fieldName'];
      configs.push(inputProperties);
      if (question['mandatory'] === 'Yes') {
        controlsConfig[question['fieldName']] = ['', Validators.required];
      }
      else {
        controlsConfig[question['fieldName']] = [''];
      }
    }
    this.formGroup = this.formBuilder.group(controlsConfig);
    return configs
  }

  getInputType(dataType: string): string {
    let inputType
    if (dataType === "String") {
      inputType = "text";
    } else if (dataType === "Date") {
      inputType = "date";
    } else if (dataType === "Number") {
      inputType = "number";
    } else if (dataType === "Float") {
      inputType = "number";
    } else {
      inputType = "text";
    }
    return inputType
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


}
