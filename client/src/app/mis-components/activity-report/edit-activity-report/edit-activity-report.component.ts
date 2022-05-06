import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {v4 as uuid} from 'uuid';
import {AlertService} from '../../../services/alert';
import {UsersService} from '../../../services/users.service';
import {FileUploadService} from '../../../services/file-upload.service';
import {ActivityReportService} from '../../../services/activity-report.service';
import {WorkPlanService} from '../../../services/work-plan-setup.service';
import {ProgramStaffService} from '../../../services/program-staff.service';
import {CellEdit} from '../../../helpers/cell-edit';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-edit-activity-report',
  templateUrl: './edit-activity-report.component.html',
  styleUrls: ['./edit-activity-report.component.css']
})
export class EditActivityReportComponent implements OnInit {

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
  activity: any;
  activityId: any;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private authService: AuthService,
              private alertService: AlertService,
              private userService: UsersService,
              private fileUploadService: FileUploadService,
              private activityReportService: ActivityReportService,
              private workPlanService: WorkPlanService,
              private activityReport: ActivityReportService,
              private router: Router,
              private programStaffService: ProgramStaffService) {
  }

  ngOnInit(): void {
    this.activityId = this.route.snapshot.params.id;


    this.getBudgetLines();
    this.activityReport.getCurrentActivityReport(this.activityId).subscribe(data =>{
      this.activity = data;
      console.log(data);
      this.getActivityDetails(data)
      this.formGroup = this.formBuilder.group({
        budgetLine: [this.activity?.budgetLine, [Validators.required]],
        name: [this.activity?.name, [Validators.required]],
        startDate:[this.activity?.startDate],
        endDate:[this.activity?.endDate],
        designation: [this.activity?.designation, [Validators.required]],
        location: [this.activity?.location],
        milestone: [this.activity?.milestone],
        activityObjectives:[this.activity?.activityObjectives],
        activityResults:[this.activity?.activityResults],
        activityUndertaken:[this.activity?.activityUndertaken],
        challenges:[this.activity?.challenges],
        lessonsLearned:[this.activity?.lessonsLearned],
        keyAchievements:[this.activity?.keyAchievements],
        activityName:[this.activity?.activityName],
        peopleReached:[''],
        costAssociated:[''],
        budgetProgress:[''],
        assignee:[''],
        attachPhoto:[''],
        attachList:[''],
        attachStories:[''],
        comments:[''],
        actionRequired:[''],
        status:['']
      });

      this.userService.getUsers().subscribe((data) => {
        this.staff = data;
      });
    })
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

  getActivityDetails(data){

    let values =  JSON.parse(data.costAssociated)
    console.log("Values",values)
    this.peopleSurvey = values.people
    this.totalBalance = values.balance
    this.budget = values.budget
    this.getTotalApproved = values.totalApproved
    this.totalSpent = values.totalSpent
    this.totalBudgetDisburse = values.budgetDisburse
    console.log(this.budget)
    // data.forEach((d) => {
    //   let values = JSON.parse(d.costAssociated)
    //   this.budget = JSON.parse(values.budget)
    //   this.peopleSurvey = values.people
    //   this.totalBalance = values.balance
    //   console.log(values)
    // })
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

      name: activityReport.name,
      costAssociated: JSON.stringify(values),
      activityResults: activityReport.activityResults,
      activityUndertaken: activityReport.activityUndertaken,
      activityObjectives: activityReport.activityObjectives,
      assignee: activityReport.assignee,
      attachList: activityReport.attachList,
      attachPhoto: activityReport.attachPhoto,
      attachStories: activityReport.attachStories,
      budgetLine: activityReport.budgetLine,
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
      this.alertService.success(`${activityReport.name} has been successfully created `);
    }, error => {
      this.alertService.error(`${activityReport.name} could not be created`);
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
          } else {
            item.totalSpent = newValue;
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
    if (event.target.id === 'attachment1') {
      this.attachment1 = files.item(0).name;
    }
    if (event.target.id === 'attachment2') {
      this.attachment2 = files.item(0).name;
    }
    if (event.target.id === 'attachment3') {
      this.attachment3 = files.item(0).name;
    }
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
          this.getTotalApproved = item.approvedAmount;
          this.totalSpent = item.totalSpent;
        }
      });
    }
  }

  updateTotalExpensesInWorkPlan(){
    this.budgetHolder.forEach((d) => {
      if (d.id == this.workPlanId) {

        let values = JSON.parse(d.setupValues);
        this.budgetLines = values.budget;
        this.budgetLines.forEach((item) => {
          if (item.id == this.choosenBudget) {

            item.totalSpent = this.newUpdatedExpenses;
            console.log("fkdfdf",d);
            this.workPlanService.updateWorkPlan(this.budgetHolder, this.workPlanId).subscribe((data) => {

            });

          }
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
          console.log(this.getMilestone);
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
      name: activityReport.name,
      costAssociated: JSON.stringify(values),
      activityResults: activityReport.activityResults,
      activityUndertaken: activityReport.activityUndertaken,
      activityObjectives: activityReport.activityObjectives,
      assignee: activityReport.assignee,
      attachList: activityReport.attachList,
      attachPhoto: activityReport.attachPhoto,
      attachStories: activityReport.attachStories,
      budgetLine: activityReport.budgetLine,
      budgetProgress: activityReport.budgetProgress,
      challenges: activityReport.challenges,
      designation: activityReport.designation,
      endDate: activityReport.endDate,
      keyAchievements: activityReport.keyAchievements,
      lessonsLearned: activityReport.lessonsLearned,
      location: activityReport.location,
      milestone: activityReport.milestone,
      activityName: activityReport.activityName,
      startDate: activityReport.startDate,
      status: statusSave
    };

    this.activityReportService.createActivityReport(savedActivityRecord).subscribe(results => {
      this.updateTotalExpensesInWorkPlan()
      this.router.navigate(['/activity-list']);
      this.alertService.success(`${activityReport.name} has been successfully created `);
    }, error => {
      this.alertService.error(`${activityReport.name} could not be created`);
    });

  }

}
