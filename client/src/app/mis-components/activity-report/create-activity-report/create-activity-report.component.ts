import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {v4 as uuid} from 'uuid';
import {ProgramStaffService} from "../../../services/program-staff.service";
import {FileUploadService} from "../../../services/file-upload.service";
import {CellEdit, OnUpdateCell} from "../../../helpers/cell-edit";
import {ActivityReportService} from "../../../services/activity-report.service";
import {PartnerSetupService} from "../../../services/partner-setup.service";

@Component({
  selector: 'app-create-activity-report',
  templateUrl: './create-activity-report.component.html',
  styleUrls: ['./create-activity-report.component.css']
})
export class CreateActivityReportComponent implements OnInit, OnUpdateCell{

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  programs = [];
  staff = [];
  budget: any = [];
  attachment1: string;
  attachment2: string;
  attachment3: string;
  loading: boolean = false;
  calendar: any = {};
  totalApprovedAmount: string;
  total1835: string;
  total1835M: string;
  total36M: string;
  total36F: string;
  totalNationalF: string;
  totalNationalM: string;
  totalRefugeeM: string;
  totalRefugeeF: string;
  totalPwdF: string;
  totalPwdM: string;
  indicatorForDisaggregation: any;
  budgetForDisaggregation: any;
  totalBudgetDisburse: string;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private fileUploadService: FileUploadService,
              private activityReportService: ActivityReportService,
              private partnerSetup: PartnerSetupService,
              private router: Router,
              private programStaffService: ProgramStaffService) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      budgetLine: ['', [Validators.required]],
      name: ['', [Validators.required]],
      startDate:[''],
      endDate:[''],
      designation: ['', [Validators.required]],
      location: [''],
      milestone: [''],
      activityObjective:[''],
      achievedResults:[''],
      activitiesUndertaken:[''],
      challenges:[''],
      lessonsLearned:[''],
      keyAchievements:[''],
      peopleReached:[''],
      costAssociated:[''],
      budgetProgress:[''],
      assignee:[''],
      attachPhoto:[''],
      attachList:[''],
      attachStories:[''],
    });
    this.programStaffService.getPrograms().subscribe((data) => {
      this.programs = data;
    });
    this.programStaffService.getProgramStaffs().subscribe((data) => {
      this.staff = data;
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  createActivityReport() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const activityReport = this.formGroup.value;
    this.activityReportService.createActivityReport(activityReport).subscribe(results => {
      this.router.navigate(['/activity-list']);
      this.alertService.success(`${activityReport.name} has been successfully created `);
    }, error => {
      this.alertService.error(`${activityReport.name} could not be created`);
    });

    // if (this.formGroup.valid) {
    //   setTimeout(() => {
    //     this.formGroup.reset();
    //     this.submitted = false;
    //   }, 100);
    // }
  }

  /** Budget line functions*/

  createNewBudgetItem() {
    let id = uuid();
    this.budget.push({id: id, budgetLine: '', approvedAmount: '', totalSpent: '', quarterlyBudget: []});

  }


  removeBudget(row) {
    this.budget = this.budget.filter(item => item.id != row.id);
  }
  cellEditor(rowId, tdId, key: string, oldValue, type?: string, selectList?: []) {
    new CellEdit().edit(rowId, tdId, oldValue, key, this.saveCellValue, type, '', selectList);
  }


  saveCellValue = (value: string, key: string, rowId): void => {
    if (value !== null && value !== undefined)
      switch (key) {
        case 'budget_line':
          if (this.budget.some(x => x.id === rowId)) {
            this.budget.forEach(function (item) {
              if (item.id === rowId) item.budgetLine = value;
            });
          }
          break;
        case 'approved_amt':
          this.updateBudgetAmount(rowId, value);
          break
        case 'total_spent':
          this.updateBudgetDisburse(rowId, value, true);
          break;
        case 'updatePeople':
          this.update1835(rowId, value);
          break;
      }
    // this.savePlan();
  }

  // savePlan(done?: boolean) {
  //   this.error = false;
  //   this.success = false;
  //
  //   console.log("this.indicators", this.indicators);
  //   let values: { [key: string]: string } = {
  //     indicators: JSON.stringify(this.indicators),
  //     budget: this.budget,
  //     quarterlyCommitment: this.quarterlyCommitment,
  //     currentStatus: this.currentStatus
  //   }
  // }

  private update1835(id, newValue) {
    switch (id) {
      case 1:
        this.total1835 = newValue;
        break;
      case 2:
        this.total1835M = newValue;
        break;
      case 3:
        this.total36F = newValue;
        break;
      case 4:
        this.total36M = newValue;
        break;
      case 5:
        this.totalNationalF = newValue;
        break;
      case 6:
        this.totalNationalM = newValue;
        break;
      case 7:
        this.totalRefugeeF = newValue;
        break;
      case 8:
        this.totalRefugeeM = newValue;
        break;
      case 9:
        this.totalPwdF = newValue;
        break;
      case 10:
        this.totalPwdM = newValue;
        break;
    }

  }

  private updateBudgetAmount(id, newValue) {
    let total: number = 0;
    if (this.budget.some(x => x.id === id)) {
      this.budget.forEach(function (item) {
        if (item.id === id) item.approvedAmount = newValue;
        total += +item.approvedAmount;
      });
    }
    this.totalApprovedAmount = total.toString();
  }

  private updateBudgetDisburse(id, newValue, editing?: boolean) {
    let total: number = 0;
    if (this.budget.some(x => x.id === id)) {
      this.budget.forEach((item) => {
        if (item.id === id) {
          if (editing) {
            if (+newValue <= +item.approvedAmount) {
              item.totalSpent = newValue;
            } else {
              this.alertService.error(`Amount spent should be less than Amount Approved`);
              return;
            }
          } else item.totalSpent = newValue;
        }
        total += +item.totalSpent;
      });
    }
    this.totalBudgetDisburse = total.toString();
    // this.currentStatus.totalAmountSpent = total;
  }


  // private updateBudgetDisburse(id, newValue) {
  //   let total: number = 0;
  //   if (this.budget.some(x => x.id === id)) {
  //     this.budget.forEach(function (item) {
  //       if (item.id === id) item.approvedAmount = newValue;
  //       total += +item.approvedAmount;
  //     });
  //   }
  //   this.totalApprovedAmount = total.toString();
  // }

  handleFileInput(event) {
    let files: FileList = event.target.files;
    if (event.target.id === "attachment1") this.attachment1 = files.item(0).name;
    if (event.target.id === "attachment2") this.attachment2 = files.item(0).name;
    if (event.target.id === "attachment3") this.attachment3 = files.item(0).name;
    this.uploadFile(files.item(0), event.target.id);
  }

  uploadFile(file, id) {
    this.loading = !this.loading;
    console.log(file);
    this.fileUploadService.upload(file).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {

          this.loading = false; // Flag variable
        }
      }
    );
  }

  onReset() {
    this.formGroup.reset();
  }


}
