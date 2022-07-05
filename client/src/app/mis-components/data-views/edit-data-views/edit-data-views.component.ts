import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DataViewService} from "../../../services/data-view.service";
import {AlertService} from "../../../services/alert";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-edit-data-views',
  templateUrl: './edit-data-views.component.html',
  styleUrls: ['./edit-data-views.component.css']
})
export class EditDataViewsComponent implements OnInit {

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
  dataViewId: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private dataViewService: DataViewService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.dataViewId = this.route.snapshot.params.id;
    this.dataViewService.getCurrentDataView(this.dataViewId).subscribe((results: any) => {
      this.formGroup = this.formBuilder.group({
        name: [results?.name, [Validators.required]],
        tableName: [results?.tableName, [Validators.required]],
        description: [results?.description, [Validators.required]],
        viewQuery: [results?.viewQuery, [Validators.required]],
      });
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  editDataView() {
    this.submitted = true;
    this.submittedViewQuery = true;
    if (this.formGroup.invalid) {
      return;
    } else {
      this.formData = this.formGroup.value;
      this.dataViewService.updateDataView(this.dataViewId, this.formData).subscribe((data) => {
        this.alertService.success(`${this.formData.name} has been successfully updated `);
        this.router.navigate(['/dataView']);
      }, error => {
        this.alertService.error(`${this.formData.name} has not been successfully updated `);
      });
    }
  }

  runQueryNow() {
    const viewQueryControl = this.formGroup.get('viewQuery');
    this.submittedViewQuery = true;
    let inputValue = (<HTMLInputElement>document.getElementById('query')).value;
    if (inputValue) {
      const params = new HttpParams()
        .set('query', inputValue);
      this.dataViewService.dataViewRunNow(inputValue).subscribe((data) => {
        console.log(data);
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

  cancel(): void {
    window.history.back();
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
