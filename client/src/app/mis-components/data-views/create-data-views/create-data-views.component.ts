import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {DataViewService} from "../../../services/data-view.service";
import {HttpParams, HttpParameterCodec, HttpUrlEncodingCodec} from '@angular/common/http';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-create-data-views',
  templateUrl: './create-data-views.component.html',
  styleUrls: ['./create-data-views.component.css']
})
export class CreateDataViewsComponent implements OnInit,HttpParameterCodec {
  @ViewChild('showQueryData') showQueryData: any;
  formGroup: FormGroup;
  entries: number = 5;
  selected: any[] = [];
  activeRow: any;
  formData: any;
  submitted = false;
  submittedViewQuery = false;
  rows: Object[];
  temp: Object[];
  columns = [];
  closeModal: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private dataViewService: DataViewService,
              private alertService: AlertService) {
  }

  encodeKey(k: string): string { return this.standardEncoding(k); }
  encodeValue(v: string): string { return this.standardEncoding(v); }
  decodeKey(k: string): string { return decodeURIComponent(k); }
  decodeValue(v: string) { return decodeURIComponent(v); }

   standardEncoding(v: string): string {
    return encodeURIComponent(v);
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      tableName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      viewQuery: ['', [Validators.required]],
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  createDataView() {
    this.submitted = true;
    this.submittedViewQuery = true;
    if (this.formGroup.invalid) {
      return;
    } else {
      this.formData = this.formGroup.value;
      this.dataViewService.createDataView(this.formData).subscribe((data) => {
        this.alertService.success(`${this.formData.name} has been successfully created `);
        this.router.navigate(['/dataView']);
      }, error => {
        this.alertService.error(`${this.formData.name} has not been successfully created `);
      });
    }
  }

  runQueryNow() {
    const viewQueryControl = this.formGroup.get('viewQuery');
    console.log(viewQueryControl);
    this.submittedViewQuery = true;
    let inputValue = (<HTMLInputElement>document.getElementById('query')).value;
    if (inputValue) {
      this.dataViewService.dataViewRunNow(inputValue).subscribe((data) => {
        if (data['headerList'].length > 0) {
          this.temp = [...data['dataList']];
          this.rows = data['dataList'];
          this.columns = this.formattedColumns(data['headerList']);
          this.openFormModal(this.showQueryData);
        }
        else {
          viewQueryControl.setErrors({
            "queryError": true
          });
        }
      }, error => console.log(error));
    } else {
      viewQueryControl.setErrors({
        "required": true
      });
    }
  }

  openFormModal(modalDom) {
    this.modalService.open(modalDom, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeModal = `Closed with: ${result}`;
    }, (reason) => {
      this.closeModal = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onReset() {
    this.formGroup.reset();
  }

  formattedColumns(array) {
    const columns = [];
    for (const column of array) {
      const columnProperties = {};
      columnProperties['prop'] = column;
      columnProperties['name'] = column.replaceAll('_', ' ').toUpperCase().trim();
      columns.push(columnProperties);
    }
    return columns;
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable(event) {
    let val = event.target.value.toLowerCase();
    this.rows = this.temp.filter(function (d) {
      for (const key in d) {
        if (d[key] !== null && d[key]?.toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  onActivate(event) {
    this.activeRow = event.row;
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
