import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {ProjectMilestoneService} from "../../../services/project-milestone.service";
import {HttpParams} from "@angular/common/http";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-create-project-milestones',
  templateUrl: './create-project-milestones.component.html',
  styleUrls: ['./create-project-milestones.component.css']
})
export class CreateProjectMilestonesComponent implements OnInit {
  @ViewChild('showQueryData') showQueryData: any;
  formGroup: FormGroup;
  submitted = false;
  formData: any;
  programs = [];
  categories = [];
  submittedViewQuery = false;
  rows: Object[];
  temp: Object[];
  columns = [];
  closeModal: string;
  entries: number = 5;
  selected: any[] = [];
  activeRow: any;
  selectedProgram = "";
  selectedProgramCategory = "";
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private modalService: NgbModal,
              private router: Router,
              private projectMilestoneService: ProjectMilestoneService) { }

  ngOnInit(): void {
    this.selectedProgram = null;
    this.selectedProgramCategory = null;
    this.formGroup = this.formBuilder.group({
      program: ['', [Validators.required]],
      programCategory: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      reportingQuery: [''],
      dashboardQuery: [''],
    });
    this.projectMilestoneService.getPrograms().subscribe(data => {
      this.programs = data;
    }, error => console.log(error));
  }

  getCategories(value) {
    this.selectedProgramCategory = null;
    this.selectedProgram = value;
    const params = new HttpParams()
        .set('id', value);
    this.projectMilestoneService.getProgramCategories(params).subscribe(data => {
      this.categories = data;
    }, error => console.log(error));
  }

  get f() {
    return this.formGroup.controls;
  }

  createMilestone() {
    this.submitted = true;
    this.submittedViewQuery = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    this.formData = this.formGroup.value;
    let reportingTable = {"reportingTable": 'milestone_reporting_table'};
    let dashboardTable = {"dashboardTable": 'milestone_dashboard_table'};
    this.formData = Object.assign(this.formData, reportingTable);
    this.formData = Object.assign(this.formData, dashboardTable);
    this.projectMilestoneService.createMilestone(this.formData).subscribe(results => {
      this.router.navigate(['/milestones']);
      this.alertService.success(`Milestone has been successfully created `);
    }, error => {
      this.alertService.error(`Milestone could not be created`);
    });

    if (this.formGroup.valid) {
      setTimeout(() => {
        this.formGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  runReportingQueryNow() {
    const reportingQueryControl = this.formGroup.get('reportingQuery');
    this.submittedViewQuery = true;
    let inputValue = (<HTMLInputElement>document.getElementById('reportingQuery')).value;
    if (inputValue) {
      const params = new HttpParams()
        .set('query', inputValue);
      this.projectMilestoneService.runQuery(params).subscribe((data) => {
        if (data['headerList'].length > 0) {
          this.temp = [...data['dataList']];
          this.rows = data['dataList'];
          this.columns = this.formattedColumns(data['headerList']);
          this.openFormModal(this.showQueryData);
        }
        else {
          reportingQueryControl.setErrors({
            "queryError": true
          });
        }
      }, error => console.log(error));
    } else {
      reportingQueryControl.setErrors({
        "isEmpty": true
      });
    }
  }

  runDashboardQueryNow() {
    const dashboardQueryControl = this.formGroup.get('dashboardQuery');
    this.submittedViewQuery = true;
    let inputValue = (<HTMLInputElement>document.getElementById('dashboardQuery')).value;
    if (inputValue) {
      const params = new HttpParams()
        .set('query', inputValue);
      this.projectMilestoneService.runQuery(params).subscribe((data) => {
        if (data['headerList'].length > 0) {
          this.temp = [...data['dataList']];
          this.rows = data['dataList'];
          this.columns = this.formattedColumns(data['headerList']);
          this.openFormModal(this.showQueryData);
        }
        else {
          dashboardQueryControl.setErrors({
            "queryError": true
          });
        }
      }, error => console.log(error));
    } else {
      dashboardQueryControl.setErrors({
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
