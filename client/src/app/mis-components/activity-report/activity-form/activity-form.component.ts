import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ReportFormService} from "../../../services/report-form.service";
import {TaskListService} from "../../../services/task-list.service";
import {FileUploadService} from "../../../services/file-upload.service";
import {WorkPlanService} from "../../../services/work-plan-setup.service";
import {UsersService} from "../../../services/users.service";
import {ProjectMilestoneService} from "../../../services/project-milestone.service";
import {AlertService} from "../../../services/alert";
import {AuthService} from "../../../services/auth.service";
import {HttpParams} from "@angular/common/http";
import DevExpress from "devextreme";
import {v4 as uuid} from 'uuid';
import {ActivityReportService} from "../../../services/activity-report.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CellEdit} from "../../../helpers/cell-edit";

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {

  taskId: string;
  taskRecord: any;
  activity: any;
  staff: any;
  budget: any = [];
  totalApprovedAmount: string;
  totalBalance: any;
  totalNationalM: string;
  choosenBudget: string;
  budgetHolderId: string
  totalBudgetDisburse: any;
  budgetLines: any;
  totalSpent: any;
  loading: boolean = false;
  getTotalApproved: any;
  getListBudgetLine = [];
  getMilestone = [];
  budgetAmount: any;
  budgetHolder: any;
  milestones: any;
  submitted = false;
  peopleSurvey: any = {};
  formGroup: FormGroup
  isDisabled: boolean

  shortLink1: string = "";
  shortLink2: string = "";
  shortLink3: string = "";
  attachment1: string;
  attachment2: string;
  attachment3: string;

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

  followup_needed = [
    {
      'name': 'Approve Report',
      'value': 'No'
    },
    {
      'name': 'Return to Sender',
      'value': 'Yes'
    },
  ];
  isReview: boolean;
  isMakeCorrections: boolean;
  isApprove: boolean;
  workPlanId: any;
  commentDisable: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private reportFormService: ReportFormService,
    private taskListService: TaskListService,
    private WorkPlanService: WorkPlanService,
    private usersService: UsersService,
    private projectMilestoneService: ProjectMilestoneService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private userServices: UsersService,
    private activityReport: ActivityReportService,
    public fileUploadService: FileUploadService,
  ) {
  }

  ngOnInit(): void {

    this.route.params
      .subscribe(p => {
        this.taskId = p['id'];
        const params = new HttpParams().set('id', this.taskId);
        this.taskListService.getTaskRecord(params).subscribe((data) => {
          this.taskRecord = data;


          this.isReview = this.taskRecord.taskDefinitionKey == "Conduct_Financial_Review"
          this.isMakeCorrections = (this.taskRecord.taskDefinitionKey == "Make_Changes_from_Finance" || this.taskRecord.taskDefinitionKey == "Make_Changes_from_Supervisor")
          this.isApprove = this.taskRecord.taskDefinitionKey == "Approve_Activity_Report"
          // this.isDisabled = this.taskRecord.taskDefinitionKey == "Approve_Activity_Report";
          this.isDisabled = true;
          if(this.isMakeCorrections) this.commentDisable = true


          this.activityReport.getCurrentActivityReport(this.taskRecord.activityId).subscribe(data => {
            this.activity = data;
            console.log("Logged dta", data);
            this.getActivityDetails(data)
            this.getBudgetLines();
            this.formGroup = this.formBuilder.group({
              budgetLine: [{value: this.activity?.budgetLine, disabled: this.isDisabled}, [Validators.required]],
              name: [{value: this.activity?.name, disabled: this.isDisabled}, [Validators.required]],
              startDate: [{value: this.activity?.startDate, disabled: this.isDisabled}],
              endDate: [{value: this.activity?.endDate, disabled: this.isDisabled}],
              designation: [{value: this.activity?.designation, disabled: this.isDisabled}, [Validators.required]],
              location: [{value: this.activity?.location, disabled: this.isDisabled}],
              milestone: [{value: this.activity?.milestone, disabled: this.isDisabled}],
              activityObjectives: [{value: this.activity?.activityObjectives, disabled: this.isDisabled}],
              activityResults: [{value: this.activity?.activityResults, disabled: this.isDisabled}],
              activityUndertaken: [{value: this.activity?.activityUndertaken, disabled: this.isDisabled}],
              activityName: [{value: this.activity?.activityName, disabled: this.isDisabled}],
              challenges: [{value: this.activity?.challenges, disabled: this.isDisabled}],
              lessonsLearned: [{value: this.activity?.lessonsLearned, disabled: this.isDisabled}],
              keyAchievements: [{value: this.activity?.keyAchievements, disabled: this.isDisabled}],
              peopleReached: [''],
              costAssociated: [''],
              budgetProgress: [''],
              assignee: [this.activity?.assignee],
              attachPhoto: [{value: this.activity?.attachPhoto, disabled: this.isDisabled}],
              attachList: [{value: this.activity?.attachList, disabled: this.isDisabled}],
              attachStory: [{value: this.activity?.attachStory, disabled: this.isDisabled}],
              comments: [{value: this.activity?.comments, disabled: this.commentDisable }],
              actionRequired: [''],
              status: ['']
            });

            this.userServices.getUsers().subscribe((data) => {
              this.staff = data;
            });
          })
        })
      })

  }

  getActivityDetails(data) {

    let values = JSON.parse(data.costAssociated)
    console.log("Values", values)
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

  get f() {
    return this.formGroup.controls;
  }

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
    this.totalBalance = parseInt(this.getTotalApproved) - (parseInt(this.totalSpent) + parseInt(this.totalBudgetDisburse))
    // this.currentStatus.totalAmountSpent = total;
  }

  createActivityReport() {


    let values: { [key: string]: string } = {
      budget: this.budget,
      people: this.peopleSurvey,
      balance: this.totalBalance,
      totalApproved: this.getTotalApproved,
      totalSpent: this.totalSpent,
      budgetDisburse: this.totalBudgetDisburse
    }

    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const activityReport = this.formGroup.value;
    console.log(activityReport)
    let statusSave = 'Approve'

    let savedActivityRecord: { [key: string]: string } = {

      name: activityReport.name,
      costAssociated: JSON.stringify(values),
      activityResults: activityReport.activityResults,
      activityName: activityReport.activityName,
      activitiesUndertaken: activityReport.activitiesUndertaken,
      activityObjectives: activityReport.activityObjectives,
      assignee: activityReport.assignee,
      attachList: activityReport.attachList,
      attachPhoto: activityReport.attachPhoto,
      attachStory: activityReport.attachStory,
      budgetLine: activityReport.budgetLine,
      comments: activityReport.comments,
      budgetProgress: activityReport.budgetProgress,
      challenges: activityReport.challenges,
      designation: activityReport.designation,
      endDate: activityReport.endDate,
      keyAchievements: activityReport.keyAchievements,
      lessonsLearned: activityReport.lessonsLearned,
      location: activityReport.location,
      milestone: activityReport.milestone,
      startDate: activityReport.startDate,
      status: statusSave
    }

    this.activityReport.updateActivityReport(savedActivityRecord, this.taskRecord.activityId,).subscribe(results => {
      this.updateTask("completed")
      this.router.navigate(['/activity-list']);
      this.alertService.success(`${activityReport.name} has been successfully created `);
    }, error => {
      this.alertService.error(`${activityReport.name} could not be created`);
    });

  }

  ///TODO:
  updateTask(status) {
    this.taskRecord.status = status;
    this.taskRecord.groupId = '[]';
    if (this.isApprove) {
      let actionRequired = this.formGroup.value.actionRequired;
      this.taskRecord.outputVariables = '{"changesRequested": "' + actionRequired + '"}'
    }
    // if(this.isApprove) {
    //   this.taskRecord.outputVariables = '{"archiveReport": "' + "Yes" + '"}'
    // }
    this.taskListService.updateTask(this.taskRecord, this.taskRecord.id).subscribe((data) => {
      console.log('successfully updated task');
    }, error => console.log('update task', error));
  }

  onReset() {
    this.formGroup.reset();
  }

  onBudgetLineChange() {
    let rowNumber = '';
    rowNumber = this.choosenBudget;
    if (this.getListBudgetLine.some(x => x.id === rowNumber)) {
      this.getListBudgetLine.forEach((item) => {
        console.log("item", item);
        if (item.id === rowNumber) {
          this.getTotalApproved = item.approvedAmount;
          this.totalSpent = item.totalSpent;
        }
      });
    }
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
        });
      }
    });

  }

  getBudgetLines() {
    this.WorkPlanService.getWorkPlan().subscribe((data) => {
      console.log(data);
      this.budgetHolder = data;
    });
  }

  /*attachments*/
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
        console.log(error);
      }
    );
  }
}
