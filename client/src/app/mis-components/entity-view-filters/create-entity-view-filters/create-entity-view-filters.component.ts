import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {EntityViewFiltersService} from "../../../services/entity-view-filters.service";
import {HttpParams} from "@angular/common/http";
import {UsersService} from "../../../services/users.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-create-entity-view-filters',
  templateUrl: './create-entity-view-filters.component.html',
  styleUrls: ['./create-entity-view-filters.component.css']
})
export class CreateEntityViewFiltersComponent implements OnInit {
  @ViewChild('showQueryData') showQueryData: any;
  formGroup: FormGroup;
  submitted = false;
  formData: any;
  entityViewId: any;
  dataCollectors: any;
  submittedViewQuery = false;
  rows: Object[];
  temp: Object[];
  columns = [];
  closeModal: string;
  entries: number = 5;
  selected: any[] = [];
  activeRow: any;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private modalService: NgbModal,
              private userService: UsersService,
              private entityViewFiltersService: EntityViewFiltersService) { }

  ngOnInit(): void {
    this.entityViewId = this.route.snapshot.params.id;
    const params = new HttpParams()
      .set('id', this.entityViewId);
    this.entityViewFiltersService.getDefaultFilterQuery(params).subscribe((results: any) => {
      this.formGroup = this.formBuilder.group({
        name: ['', [Validators.required]],
        description: [''],
        filterQuery: [results?.viewQuery],
        users: ['']
      });
    }, error => console.log(error));

    this.userService.getDataCollectors().subscribe((data) => {
      this.dataCollectors = data;
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  createEntityViewFilter() {
    this.submitted = true;
    this.submittedViewQuery = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    this.formData = this.formGroup.value;
    let entityView = {"entityView": this.entityViewId};
    this.formData = Object.assign(this.formData, entityView);
    let users = this.formData.users;
    this.entityViewFiltersService.createEntityViewFilter(this.formData).subscribe(results => {
      console.log(results['id'])
      const params = new HttpParams()
        .set('id', results['id'])
        .set('users', users);
      this.entityViewFiltersService.saveUserEntityViewFilter(params).subscribe(results => {
        this.router.navigate(['/entityViewFilter']);
        this.alertService.success(`${this.formData.name} has been successfully created `);
      });
    }, error => {
      this.alertService.error(`${this.formData.name} could not be created`);
    });

    if (this.formGroup.valid) {
      setTimeout(() => {
        this.formGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  runFilterQueryNow() {
    const filterQueryControl = this.formGroup.get('filterQuery');
    this.submittedViewQuery = true;
    let inputValue = (<HTMLInputElement>document.getElementById('query')).value;
    if (inputValue) {
      const params = new HttpParams()
        .set('query', inputValue);
      this.entityViewFiltersService.runFilterQueryNow(params).subscribe((data) => {
        if (data['headerList'].length > 0) {
          this.temp = [...data['dataList']];
          this.rows = data['dataList'];
          this.columns = this.formattedColumns(data['headerList']);
          this.openFormModal(this.showQueryData);
        }
        else {
          filterQueryControl.setErrors({
            "queryError": true
          });
        }
      }, error => console.log(error));
    } else {
      filterQueryControl.setErrors({
        "isEmpty": true
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

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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

  onReset() {
    this.formGroup.reset();
  }

}
