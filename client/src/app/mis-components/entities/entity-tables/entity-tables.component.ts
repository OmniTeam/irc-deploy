import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SelectionType} from '@swimlane/ngx-datatable';
import {HttpParams} from "@angular/common/http";
import {EntityService} from "../../../services/entity.service";
import {ReplacePipe} from "../../../replace-pipe";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../../services/alert";
import {TagService} from "../../../services/tags";

@Component({
  selector: 'app-entity-tables',
  templateUrl: './entity-tables.component.html',
  styleUrls: ['./entity-tables.component.css']
})
export class EntityTablesComponent implements OnInit {

  entityName = "";
  entries = 50;
  selected = [];
  activeRow: any;
  rows: Object[];
  columns: any;
  entityId = "";
  SelectionType = SelectionType;
  closeModal: string;
  formInputConfigs: any;
  formGroup: FormGroup;
  tagFormGroup: FormGroup;
  submitted = false;
  tagTypes = [];
  tags = [];
  enableTagging: any;
  enableTagButton = false;
  enableRemoveTagButton = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private entityService: EntityService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private tagService: TagService) {
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

  onCheckboxChangeFn(event) {
    if (event.target.checked) {
      this.enableTagButton = !!this.enableTagging;
      this.enableRemoveTagButton = !!this.enableTagging;
    } else {
      this.enableTagButton = false;
      this.enableRemoveTagButton = false;
    }
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  get f() {
    return this.formGroup.controls;
  }

  get fTag() {
    return this.tagFormGroup.controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entityId = params.id;
      this.getEntityData();
    });

    this.tagFormGroup = this.formBuilder.group({
      tagType: ['', Validators.required],
      tag: ['', Validators.required]
    });
  }

  getEntityData() {
    const params = new HttpParams()
      .set('id', this.entityId);
    this.entityService.getEntityData(params).subscribe((data) => {
      this.entityName = new ReplacePipe().transform(data.entity['name'], '_', ' ');
      this.rows = data.resultList;
      this.tagTypes = data.tagTypeList;
      this.enableTagging = data.enableTagging;
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
    this.modalService.open(modalDom, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeModal = `Closed with: ${result}`;
    }, (reason) => {
      this.closeModal = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getTags(tagTypeId) {
    const params = new HttpParams()
      .set('id', tagTypeId);
    this.tagService.getTagsByTagType(params).subscribe((data) => {
      this.tags = data;
    }, error => console.log(error));
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
      this.getEntityData();
      this.alertService.success(`New record has been successfully inserted `);
    }, error => {
      this.alertService.error(`New record has not been successfully inserted `);
    });
    this.modalService.dismissAll('Dismissed after saving data');
    this.router.navigate(['/entity/' + this.entityId]);

    if (this.formGroup.valid) {
      setTimeout(() => {
        this.formGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  addTagToRecord() {
    const newTaggingRecord = this.tagFormGroup.value;
    const params = new HttpParams()
      .set('id', this.entityId);

    const post = {};
    post['mis_entity_id'] = this.entityId;
    post['record_id'] = this.selected[0]['id'];
    post['tag_type_id'] = newTaggingRecord.tagType;
    post['tag_id'] = newTaggingRecord.tag;

    this.tagService.addEntityTagRecord(post, params).subscribe((data) => {
      this.getEntityData();
      this.alertService.success(`Record has been tagged successfully`);
    }, error => {
      this.alertService.error(`Record has not been tagged`);
    });
    this.modalService.dismissAll('Dismissed after saving data');
    this.router.navigate(['/entity/' + this.entityId]);

    if (this.tagFormGroup.valid) {
      setTimeout(() => {
        this.tagFormGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  removeTagToRecord() {
    const taggingRecord = this.tagFormGroup.value;
    const params = new HttpParams()
      .set('id', this.entityId);

    const post = {};
    post['mis_entity_id'] = this.entityId;
    post['record_id'] = this.selected[0]['id'];
    post['tag_id'] = taggingRecord.tag;

    this.tagService.removeEntityTagRecord(post, params).subscribe((data) => {
      this.getEntityData();
      this.alertService.success(`Record has been untagged successfully`);
    }, error => {
      this.alertService.error(`Record has not been untagged`);
    });
    this.modalService.dismissAll('Dismissed after saving data');
    this.router.navigate(['/entity/' + this.entityId]);

    if (this.tagFormGroup.valid) {
      setTimeout(() => {
        this.tagFormGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  generateFormInputConfigs(questions: any) {
    const configs = [];
    const controlsConfig = {}
    for (const question of questions) {
      if (question['fieldType'] !== 'Key Field' && question['fieldType'] !== 'Tag Field') {
        const inputProperties = {};
        inputProperties['label'] = question['displayName'];
        inputProperties['type'] = this.getInputType(question['dataType']);
        inputProperties['controlName'] = question['fieldName'];
        configs.push(inputProperties);
        if (question['mandatory'] === 'Yes') {
          controlsConfig[question['fieldName']] = ['', Validators.required];
        } else {
          controlsConfig[question['fieldName']] = [''];
        }
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
