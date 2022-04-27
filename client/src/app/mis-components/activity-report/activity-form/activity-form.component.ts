import { Component, OnInit } from '@angular/core';
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
import data = DevExpress.data;
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
  totalBalance:any;
  totalNationalM: string;
  choosenBudget: string;
  budgetHolderId: string
  totalBudgetDisburse: any;
  budgetLines: any;
  totalSpent: any;
  getTotalApproved: any;
  getListBudgetLine = [];
  getMilestone = [];
  budgetAmount: any;
  budgetHolder: any;
  milestones: any;
  submitted = false;
  peopleSurvey:any = {};
  formGroup: FormGroup

  followup_needed = [
    {
      'name': 'Approve Report',
      'value': 'Yes'
    },
    {
      'name': 'Return to Sender',
      'value': 'No'
    },
  ];
  isReview: boolean;
  isMakeCorrections: boolean;
  isApprove: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private reportFormService: ReportFormService,
    private taskListService: TaskListService,
    private fileUploadService: FileUploadService,
    private WorkPlanService: WorkPlanService,
    private usersService: UsersService,
    private projectMilestoneService: ProjectMilestoneService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private userServices: UsersService,
    private activityReport: ActivityReportService
  ) { }

  ngOnInit(): void {

    this.route.params
      .subscribe(p =>{
        this.taskId = p['id'];
        const params = new HttpParams().set('id', this.taskId);
        this.taskListService.getTaskRecord(params).subscribe((data) =>{
          this.taskRecord = data;

          this.isReview = this.taskRecord.taskDefinitionKey=="Conduct_Financial_Review"
          this.isMakeCorrections = (this.taskRecord.taskDefinitionKey=="Make_Changes_from_Finance" && this.taskRecord.taskDefinitionKey=="Make_Changes_from_Supervisor")
          this.isApprove = this.taskRecord.taskDefinitionKey=="Approve_Activity_Report"

          this.activityReport.getCurrentActivityReport(this.taskRecord.activityId).subscribe(data =>{
            this.activity = data;
            console.log(this.activity)
            this.formGroup = this.formBuilder.group({
              budgetLine: [this.activity?.budgetLine, [Validators.required]],
              name: [this.activity?.name, [Validators.required]],
              startDate:[this.activity?.startDate],
              endDate:[this.activity?.endDate],
              designation: [this.activity?.designation, [Validators.required]],
              location: [this.activity?.location],
              milestone: [this.activity?.milestone],
              activityObjective:[this.activity?.activityObjective],
              achievedResults:[this.activity?.achievedResults],
              activitiesUndertaken:[this.activity?.activitiesUndertaken],
              challenges:[this.activity?.challenges],
              lessonsLearned:[this.activity?.lessonsLearned],
              keyAchievements:[this.activity?.keyAchievements],
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

            this.userServices.getUsers().subscribe((data) => {
              this.staff = data;
            });
          })
          })
        })

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
    let values: {[key: string]: string};
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


    let values: {[key: string]: string} = {
      budget: this.budget,
      people: this.peopleSurvey,
      balance: this.totalBalance
    }

    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const activityReport = this.formGroup.value;
    console.log(activityReport)
    let statusSave = 'Approve'

    let savedActivityRecord: {[key:string]: string} = {

      name: activityReport.name,
      costAssociated: JSON.stringify(values),
      achievedResults: activityReport.achievedResults,
      activitiesUndertaken: activityReport.activitiesUndertaken,
      activityObjective: activityReport.activityObjective,
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
      startDate: activityReport.startDate,
      status: statusSave
    }

    this.activityReport.updateActivityReport(savedActivityRecord,this.taskRecord.activityId,).subscribe(results => {
      this.updateTask("completed")
      this.router.navigate(['/activity-list']);
      this.alertService.success(`${activityReport.name} has been successfully created `);
    }, error => {
      this.alertService.error(`${activityReport.name} could not be created`);
    });

  }

  updateTask(status){
    this.taskRecord.status = status;
    this.taskRecord.groupId = this.taskRecord.groupId ?? '';
    if (this.isReview) {
      let actionRequired = this.formGroup.value.actionRequired;
      this.taskRecord.outputVariables = '{"changesRequested": "' + actionRequired + '","groupId:"""}'
    }
    if(this.isApprove) {
      this.taskRecord.outputVariables = '{"archiveReport": "' + "Yes" + '","groupId:"""}'
    }
    this.taskListService.updateTask(this.taskRecord, this.taskRecord.id).subscribe((data) => {
      console.log('successfully updated task');
    }, error => console.log('update task', error));
  }

  onReset() {
    this.formGroup.reset();
  }
}
