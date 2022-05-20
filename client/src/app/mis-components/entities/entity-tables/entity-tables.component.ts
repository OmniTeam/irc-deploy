import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SelectionType} from '@swimlane/ngx-datatable';
import {HttpParams} from "@angular/common/http";
import {EntityService} from "../../../services/entity.service";
import {ReplacePipe} from "../../../pipes/replace-pipe";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../../services/alert";
import {TagService} from "../../../services/tags";
import {NgSelectComponent} from "@ng-select/ng-select";
import {ExportService} from "../../../services/export.service";

@Component({
  selector: 'app-entity-tables',
  templateUrl: './entity-tables.component.html',
  styleUrls: ['./entity-tables.component.css']
})
export class EntityTablesComponent implements OnInit {
  @ViewChild('editEntityRecordModal') editEntityRecordModal: any;
  entityName = "";
  entries = 10;
  selected = [];
  activeRow: any;
  rows: Object[];
  temp: Object[];
  columns: any;
  entityId = "";
  SelectionType = SelectionType;
  closeModal: string;
  formInputConfigs: any;
  editFormInputConfigs: any;
  formGroup: FormGroup;
  editFormGroup: FormGroup;
  tagFormGroup: FormGroup;
  submitted = false;
  editSubmit = false;
  tagTypes = [];
  tags = [];
  tagFilters = [];
  enableTagging: any;
  enableTagButton = false;
  enableRemoveTagButton = false;
  selectedTagTypeFilter = "";
  selectedTagFilter = "";
  recordId = "";
  openPopup: boolean;
  loading: boolean;
  uploadMessage: string = "Uploading attachment, please wait ..."

  constructor(private route: ActivatedRoute,
              private router: Router,
              private entityService: EntityService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private exportService: ExportService,
              private alertService: AlertService,
              private tagService: TagService) {
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable(event) {
    let val = event.target.value.toLowerCase();
    this.rows = this.temp.filter(function (d) {
      for (const key in d) {
        if (d[key]?.toLowerCase().indexOf(val) !== -1) {
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

  get fEdit() {
    return this.editFormGroup.controls;
  }

  get fTag() {
    return this.tagFormGroup.controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entityId = params.id;
      this.selectedTagTypeFilter = null;
      this.selectedTagFilter = null;
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
    this.loading = true;
    this.entityService.getEntityData(params).subscribe((data) => {
      this.entityName = new ReplacePipe().transform(data.entity['name'], '_', ' ');
      this.temp = [...data.resultList];
      this.rows = data.resultList;
      this.tagTypes = data.tagTypeList;
      this.enableTagging = data.enableTagging;
      this.columns = this.columnMappings(data.headerList);
      this.formInputConfigs = this.generateFormInputConfigs(data.headerList);
      this.loading = false
    }, error => {console.log(error)});
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
    this.modalService.open(modalDom, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeModal = `Closed with: ${result}`;
    }, (reason) => {
      this.closeModal = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  createTag(){
    this.router.navigate(['/tags']);
  }

  getTags(tagTypeId) {
    const params = new HttpParams()
      .set('id', tagTypeId);
    this.tagService.getTagsByTagType(params).subscribe((data) => {
      this.tags = data;
    }, error => console.log(error));
  }

  addNewEntityRecord() {
    const params = new HttpParams()
      .set('id', this.entityId);

    this.submitted = true;
    if (this.formGroup.invalid) {
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
    this.router.navigate(['/entity/showData/' + this.entityId]);

    if (this.formGroup.valid) {
      setTimeout(() => {
        this.formGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  editEntityDataRecordButton(row) {
    this.editFormInputConfigs = this.generateEditFormInputConfigs(row, this.formInputConfigs);
    this.recordId = row['id'];
    this.openFormModal(this.editEntityRecordModal);
  }

  editEntityDataRecord() {
    const params = new HttpParams()
      .set('id', this.recordId)
      .set('entityId', this.entityId);

    this.editSubmit = true;
    if (this.editFormGroup.invalid) {
      return;
    }

    const entityRecord = this.editFormGroup.value;
    this.entityService.updateEntityRecord(entityRecord, params).subscribe((data) => {
      this.getEntityData();
      this.alertService.success(`Record has been successfully updated `);
    }, error => {
      this.alertService.error(`Record has not been successfully updated `);
    });
    this.modalService.dismissAll('Dismissed after saving data');
    this.router.navigate(['/entity/showData/' + this.entityId]);

    if (this.editFormGroup.valid) {
      setTimeout(() => {
        this.editFormGroup.reset();
        this.editSubmit = false;
      }, 100);
    }
  }

  deleteEntityDataRecord(row) {
    const deletedRow = row.id;
    const params = new HttpParams()
      .set('id', deletedRow)
      .set('entityId', this.entityId);

    if (confirm('Are you sure to delete this Record?')) {
      this.entityService.deleteEntityRecord(params).subscribe((result) => {
          this.alertService.warning(`Record has been  deleted `);
          this.getEntityData();
        }, error => {
          this.alertService.error(`Record could not be deleted`)
        }
      );
    }
  }


  addTagToRecord() {
    const newTaggingRecord = this.tagFormGroup.value;
    const params = new HttpParams()
      .set('id', this.entityId);

    let selectedRows = this.selected;
    let postRequest = [];
    for (const selectedRow of selectedRows) {
      const post = {};
      post['mis_entity_id'] = this.entityId;
      post['record_id'] = selectedRow['id'];
      post['tag_type_id'] = newTaggingRecord.tagType;
      post['tag_id'] = newTaggingRecord.tag;
      postRequest.push(post);
    }
    this.tagService.addEntityTagRecord(postRequest, params).subscribe((data) => {
      this.getEntityData();
      this.alertService.success(`Record has been tagged successfully`);
    }, error => {
      this.alertService.error(`Record has not been tagged`);
    });
    this.modalService.dismissAll('Dismissed after saving data');
    this.router.navigate(['/entity/showData/' + this.entityId]);
    this.selected = [];

    if (this.tagFormGroup.valid) {
      setTimeout(() => {
        this.tagFormGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  removeTagToRecord() {
    const deleteTaggingRecord = this.tagFormGroup.value;
    const params = new HttpParams()
      .set('id', this.entityId);

    let selectedRows = this.selected;
    let postRequest = [];
    for (const selectedRow of selectedRows) {
      const post = {};
      post['mis_entity_id'] = this.entityId;
      post['record_id'] = selectedRow['id'];
      post['tag_type_id'] = deleteTaggingRecord.tagType;
      post['tag_id'] = deleteTaggingRecord.tag;
      postRequest.push(post);
    }

    this.tagService.removeEntityTagRecord(postRequest, params).subscribe((data) => {
      this.getEntityData();
      this.alertService.success(`Record has been untagged successfully`);
    }, error => {
      this.alertService.error(`Record has not been untagged`);
    });
    this.modalService.dismissAll('Dismissed after saving data');
    this.router.navigate(['/entity/showData/' + this.entityId]);
    this.selected = [];

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
        inputProperties['mandatory'] = question['mandatory'];
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

  generateEditFormInputConfigs(data: any, formInputConfigs: any) {
    const controlsConfig = {};
    for (const formInputConfig of formInputConfigs) {
      if (formInputConfig['mandatory'] === 'Yes') {
        controlsConfig[formInputConfig['controlName']] = [data[formInputConfig['controlName']], Validators.required];
      } else {
        controlsConfig[formInputConfig['controlName']] = [data[formInputConfig['controlName']]];
      }
    }
    this.editFormGroup = this.formBuilder.group(controlsConfig);
    return formInputConfigs
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

  onChangeTagType(value) {
    this.selectedTagFilter = null;
    this.getTagFilters(value);
    this.selectedTagTypeFilter = value;
    this.getFilteredEntityData();
  }

  getTagFilters(tagTypeId) {
    const params = new HttpParams()
      .set('id', tagTypeId);
    this.tagService.getTagsByTagType(params).subscribe((data) => {
      this.tagFilters = data;
    }, error => console.log(error));
  }

  onChangeTag(value) {
    this.selectedTagFilter = value;
    this.getFilteredEntityData();
  }

  getFilteredEntityData() {
    if (!this.selectedTagTypeFilter) {
      this.selectedTagTypeFilter = "";
    }
    if (!this.selectedTagFilter) {
      this.selectedTagFilter = "";
    }
    const params = new HttpParams()
      .set('id', this.entityId)
      .set('tagTypeFilter', this.selectedTagTypeFilter)
      .set('tagFilter', this.selectedTagFilter);
    this.entityService.getEntityData(params).subscribe((data) => {
      this.temp = [...data.resultList];
      this.rows = data.resultList;
      this.columns = this.columnMappings(data.headerList);
    }, error => console.log(error));
  }

  exportExcelFormData() {
    if (!this.selectedTagTypeFilter) {
      this.selectedTagTypeFilter = "";
    }
    if (!this.selectedTagFilter) {
      this.selectedTagFilter = "";
    }
    const params = new HttpParams()
      .set('id', this.entityId)
      .set('tagTypeFilter', this.selectedTagTypeFilter)
      .set('tagFilter', this.selectedTagFilter);

    this.entityService.exportEntityData(params).subscribe((data) => {
      this.exportService.exportJsonToExcel(data['data'], data['file']);
    }, error => console.log(error));
  }

  exportCSVFormData() {
    if (!this.selectedTagTypeFilter) {
      this.selectedTagTypeFilter = "";
    }
    if (!this.selectedTagFilter) {
      this.selectedTagFilter = "";
    }
    const params = new HttpParams()
      .set('id', this.entityId)
      .set('tagTypeFilter', this.selectedTagTypeFilter)
      .set('tagFilter', this.selectedTagFilter);

    this.entityService.exportEntityData(params).subscribe((data) => {
      this.exportService.exportToCsv(data['data'], data['file']);
    }, error => console.log(error));
  }

  importExcelFormData() {
    this.openPopup = true
  }

  handleFileInput(event) {
    this.loading = !this.loading;
    let files: FileList = event.target.files;
    this.entityService.uploadExcelFile(files.item(0), this.entityId).subscribe((data) => {
      this.uploadMessage = data[0]
      setTimeout(() => {
        this.loading = false;
        this.closePopUp()
        this.getEntityData();
      }, 3000);
    }, error => {
      console.log(error)
      this.uploadMessage = "Failed to upload file, try again."
      setTimeout(() => {this.loading = false}, 3000);
    });
  }

  closePopUp(){
    this.openPopup = false
  }
}
