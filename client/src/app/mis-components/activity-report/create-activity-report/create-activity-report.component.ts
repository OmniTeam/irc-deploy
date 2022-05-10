import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../../services/alert';
import {v4 as uuid} from 'uuid';
import {ProgramStaffService} from '../../../services/program-staff.service';
import {FileUploadService} from '../../../services/file-upload.service';
import {CellEdit, OnUpdateCell} from '../../../helpers/cell-edit';
import {ActivityReportService} from '../../../services/activity-report.service';
import {WorkPlanService} from '../../../services/work-plan-setup.service';
import {AuthService} from '../../../services/auth.service';
import {UsersService} from '../../../services/users.service';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-create-activity-report',
  templateUrl: './create-activity-report.component.html',
  styleUrls: ['./create-activity-report.component.css']
})
export class CreateActivityReportComponent implements OnInit, OnUpdateCell {

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
  totalBalance: any;
  totalNationalM: string;
  choosenBudget: string;
  budgetHolderId: string;
  totalBudgetDisburse: any;
  budgetLines: any;
  totalSpent: any;
  getTotalApproved: any;
  getListBudgetLine = [];
  getMilestone = [];
  budgetAmount: any;
  budgetHolder: any;
  milestones: any;
  peopleSurvey: any = {};

  location_id = [
    {
      'name': 'BAKULI'
    },
    {
      'name': 'BUNGA'
    },
    {
      'name': 'BWAISE'
    },
    {
      'name': 'KABALAGALA'
    }, {
      'name': 'KAMPALA_CENTRAL'
    }, {
      'name': 'KAMWOKYA'
    }, {
      'name': 'KANSANGA'
    }, {
      'name': 'KASOKOSO'
    }, {
      'name': 'KASUBI'
    }, {
      'name': 'KATWE'
    }, {
      'name': 'KATWE_II'
    }, {
      'name': 'KAWAALA'
    }, {
      'name': 'KAWEMPE'
    }, {
      'name': 'KAZO ANGOLA'
    }, {
      'name': 'KINAWATAKA'
    }, {
      'name': 'KISENYI'
    }, {
      'name': 'KOSOVO'
    }, {
      'name': 'KYEBANDO'
    }, {
      'name': 'LUGALA'
    },
    {
      'name': 'MAKINDYE'
    }, {
      'name': 'MENGO'
    }, {
      'name': 'MAKINDYE'
    }, {
      'name': 'NAAKULABYE'
    }, {
      'name': 'NABULAGALA'
    }, {
      'name': 'NAMUWONGO'
    }, {
      'name': 'NDEJJE'
    }, {
      'name': 'NSAMBYA'
    }, {
      'name': 'SSABAGABO'
    },
  ];
  workPlanId: string;
  newUpdatedExpenses: any;
  workPlanUpdate: any;
  indicators: any;
  quarterlyCommitment: any;
  currentStatus: any;
  userId: any;
  partnerId: string;
  programId: any;
   startDate: any;
   endDate: any;
   reportingStartDate: any;
   periodType: any;
   startCycle: string;
   responsiblePerson: any;
   budgetLineName: any;
   singleMilestone: any;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private authService: AuthService,
              private alertService: AlertService,
              private userService: UsersService,
              private fileUploadService: FileUploadService,
              private activityReportService: ActivityReportService,
              private workPlanService: WorkPlanService,
              private router: Router,
              private programStaffService: ProgramStaffService) {
  }

  ngOnInit(): void {
    this.getBudgetLines();
    this.formGroup = this.formBuilder.group({
      budgetLine: ['', [Validators.required]],
      name: ['', [Validators.required]],
      startDate: [''],
      endDate: [''],
      designation: ['', [Validators.required]],
      location: [''],
      milestone: [''],
      activityName: [''],
      activityObjectives: [''],
      activityResults: [''],
      activityUndertaken: [''],
      challenges: [''],
      lessonsLearned: [''],
      keyAchievements: [''],
      peopleReached: [''],
      costAssociated: [''],
      budgetProgress: [''],
      assignee: [''],
      attachPhoto: [''],
      attachList: [''],
      attachStory: [''],
      status: ['Pending']
    });
    this.programStaffService.getPrograms().subscribe((data) => {
      this.programs = data;
    });
    this.userService.getUsers().subscribe((data) => {
      this.staff = data;
    });
  }


  get f() {
    return this.formGroup.controls;
  }

  createActivityReport() {


    let values: { [key: string]: string } = {
      budget: this.budget,
      people: this.peopleSurvey,
      balance: this.totalBalance,
      totalApproved: this.getTotalApproved,
      totalSpent: this.totalSpent,
      budgetDisburse: this.totalBudgetDisburse
    };

    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const activityReport = this.formGroup.value;

    let statusSave = 'Started';

    let savedActivityRecord: { [key: string]: string } = {

      name: this.responsiblePerson,
      costAssociated: JSON.stringify(values),
      activityResults: activityReport.activityResults,
      activityUndertaken: activityReport.activityUndertaken,
      activityObjectives: activityReport.activityObjectives,
      assignee: activityReport.assignee,
      attachList: activityReport.attachList,
      attachPhoto: activityReport.attachPhoto,
      attachStory: activityReport.attachStory,
      budgetLine: this.budgetLineName,
      budgetProgress: activityReport.budgetProgress,
      challenges: activityReport.challenges,
      designation: activityReport.designation,
      endDate: activityReport.endDate,
      keyAchievements: activityReport.keyAchievements,
      lessonsLearned: activityReport.lessonsLearned,
      location: activityReport.location,
      activityName: activityReport.activityName,
      milestone: activityReport.milestone,
      startDate: activityReport.startDate,
      status: statusSave
    };
    console.log("Activity",savedActivityRecord);
    this.activityReportService.createActivityReport(savedActivityRecord).subscribe(results => {
      this.updateTotalExpensesInWorkPlan()
      this.router.navigate(['/activity-list']);
      this.alertService.success(`${this.budgetLineName} has been successfully created `);
    }, error => {
      this.alertService.error(`${this.budgetLineName} could not be created`);
    });

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
    if (value !== null && value !== undefined) {
      switch (key) {
        case 'budget_line':
          if (this.budget.some(x => x.id === rowId)) {
            this.budget.forEach(function (item) {
              if (item.id === rowId) {
                item.budgetLine = value;
              }
            });
          }
          break;
        case 'approved_amt':
          this.updateBudgetAmount(rowId, value);
          break;
        case 'total_spent':
          this.updateBudgetDisburse(rowId, value, true);
          break;
        case 'updatePeople':
          this.update1835(rowId, value);
          break;
      }
    }
    // this.savePlan();
  };

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
    let values: { [key: string]: string };
    switch (id) {
      case 1:
        this.peopleSurvey.total1835 = newValue;
        break;
      case 2:
        this.peopleSurvey.total1835M = newValue;
        break;
      case 3:
        this.peopleSurvey.total36F = newValue;
        break;
      case 4:
        this.peopleSurvey.total36M = newValue;
        break;
      case 5:
        this.peopleSurvey.totalNationalF = newValue;
        break;
      case 6:
        this.peopleSurvey.totalNationalM = newValue;
        break;
      case 7:
        this.peopleSurvey.totalRefugeeF = newValue;
        break;
      case 8:
        this.peopleSurvey.totalRefugeeM = newValue;
        break;
      case 9:
        this.peopleSurvey.totalPwdF = newValue;
        break;
      case 10:
        this.peopleSurvey.totalPwdM = newValue;
        break;
    }
  }

  private updateBudgetAmount(id, newValue) {
    let total: number = 0;
    if (this.budget.some(x => x.id === id)) {
      this.budget.forEach(function (item) {
        if (item.id === id) {
          item.approvedAmount = newValue;
        }
        total += +item.approvedAmount;
      });
    }
    this.totalApprovedAmount = total.toString();
  }


  ///TODO pick images
  private updateBudgetDisburse(id, newValue, editing?: boolean) {
    let total: number = 0;
    if (this.budget.some(x => x.id === id)) {
      this.budget.forEach((item) => {
        if (item.id === id) {
          if (editing) {
            if (+newValue <= +item.approvedAmount) {
              item.totalSpent = newValue;
            } else {
              item.totalSpent = newValue;
            }
          }
        }
        total += +item.totalSpent;
      });
    }
    this.totalBudgetDisburse = total.toString();
    this.totalBalance = parseInt(this.getTotalApproved) - (parseInt(this.totalSpent) + parseInt(this.totalBudgetDisburse));
    this.newUpdatedExpenses = (+this.totalSpent + +this.totalBudgetDisburse)
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
    this.uploadFile(files.item(0), event.target.id);
  }

  uploadFile(file, id) {
    this.loading = !this.loading;
    console.log(file);
    this.fileUploadService.upload(file, 'activity-report').subscribe((data) => {
        if (id === "attachPhoto") this.formGroup.patchValue({attachPhoto: data.path});
        if (id === "attachList") this.formGroup.patchValue({attachList: data.path});
        if (id === "attachStory") this.formGroup.patchValue({attachStory: data.path});
        this.loading = false;
      }, error => {
        console.log(error);}
    );
  }

  onReset() {
    this.formGroup.reset();
  }

  getBudgetLines() {
    this.workPlanService.getWorkPlan().subscribe((data) => {
      console.log(data);
      this.budgetHolder = data;
    });
  }


  onBudgetLineChange() {
    let rowNumber = '';
    rowNumber = this.choosenBudget;
    if (this.getListBudgetLine.some(x => x.id === rowNumber)) {
      this.getListBudgetLine.forEach((item) => {
        if (item.id === rowNumber) {
          this.budgetLineName = item.budgetLine
          this.getTotalApproved = item.approvedAmount;
          this.totalSpent = item.totalSpent;
        }
      });
    }
  }

  updateTotalExpensesInWorkPlan(){
    this.budgetHolder.forEach((d) => {
      if (d.id == this.workPlanId) {
        const params2 = new HttpParams().set('id', this.workPlanId);
        this.workPlanService.getWorkPlanRecord(params2).subscribe((data) =>{
          this.workPlanUpdate = data.setup

      let values = JSON.parse(d.setupValues);
        this.budgetLines = values.budget;
        this.indicators = values.indicators;
        this.quarterlyCommitment = values.quarterlyCommitment;
        this.currentStatus = values.currentStatus
          this.userId =  this.workPlanUpdate.userId
          this.partnerId =  this.workPlanUpdate.partnerId
          this.programId =  this.workPlanUpdate.programId
          this.startDate = this.workPlanUpdate.startDate
          this.endDate = this.workPlanUpdate.endDate
          this.reportingStartDate = this.workPlanUpdate.reportingStartDate
          this.periodType = this.workPlanUpdate.periodType
          this.startCycle = this.workPlanUpdate.startCycle

      this.budgetLines.forEach((item) => {
        if (item.id == this.choosenBudget) {

          item.totalSpent = this.newUpdatedExpenses.toString();


          let newValues: { [key: string]: string } = {
            indicators: this.indicators,
            budget: this.budgetLines,
            quarterlyCommitment: this.quarterlyCommitment,
            currentStatus: this.currentStatus
          }

          let workPlanRecord: { [key: string]: string } = {
            userId: this.userId,
            partnerId: this.partnerId,
            programId: this.programId,
            setupValues: JSON.stringify(newValues),
            startDate: this.startDate,
            endDate: this.endDate,
            reportingStartDate: this.reportingStartDate,
            periodType: this.periodType,
            startCycle: this.startCycle,

          }
          this.workPlanService.updateWorkPlan(workPlanRecord, this.workPlanId).subscribe((data) => {

          });

        }
      })
      })
    }
    })
    // console.log("Budget Holder", this.budgetHolder);

  }

  getBudgetHolderBudgetLines() {
    let staffId = this.budgetHolderId;
    console.log(staffId);
    let newBudgetLine: any = [];
    let newMilestone: any = [];
    this.budgetHolder.forEach((d) => {
      if (d.staffId === staffId) {
        this.workPlanId = d.id
        this.responsiblePerson = d.staff
        let values = JSON.parse(d.setupValues);
        this.milestones = JSON.parse(values.indicators);
        this.budgetLines = values.budget;
        this.budgetLines.forEach((item) => {
          newBudgetLine.push(item);
          this.getListBudgetLine = newBudgetLine;
        });
        this.milestones.forEach((mile) => {
          newMilestone.push(mile);
          this.getMilestone = newMilestone;
          this.singleMilestone = this.getMilestone[0].name
          this.formGroup.get('milestone').setValue(this.singleMilestone)
        });
      }
    });

  }


  saveReport() {

    let values: { [key: string]: string } = {
      budget: this.budget,
      people: this.peopleSurvey,
      balance: this.totalBalance,
      totalApproved: this.getTotalApproved,
      totalSpent: this.totalSpent,
      budgetDisburse: this.totalBudgetDisburse
    };


    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const activityReport = this.formGroup.value;
    let statusSave = 'Pending';

    let savedActivityRecord: { [key: string]: string } = {
      name: this.responsiblePerson,
      costAssociated: JSON.stringify(values),
      activityResults: activityReport.activityResults,
      activityUndertaken: activityReport.activityUndertaken,
      activityObjectives: activityReport.activityObjectives,
      assignee: activityReport.assignee,
      attachList: activityReport.attachList,
      attachPhoto: activityReport.attachPhoto,
      attachStory: activityReport.attachStory,
      budgetLine: this.budgetLineName,
      budgetProgress: activityReport.budgetProgress,
      challenges: activityReport.challenges,
      designation: activityReport.designation,
      endDate: activityReport.endDate,
      keyAchievements: activityReport.keyAchievements,
      lessonsLearned: activityReport.lessonsLearned,
      location: activityReport.location,
      activityName: activityReport.activityName,
      milestone: activityReport.milestone,
      startDate: activityReport.startDate,
      status: statusSave
    };

    this.activityReportService.createActivityReport(savedActivityRecord).subscribe(results => {
      this.updateTotalExpensesInWorkPlan()
      this.router.navigate(['/activity-list']);
      this.alertService.success(`${this.budgetLineName} has been successfully saved `);
    }, error => {
      this.alertService.error(`${this.budgetLineName} could not be saved`);
    });

  }
}
