import {Component, OnInit} from '@angular/core';
import {ReferralsService} from "../../services/referrals.service";
import {FeedbackService} from "../../services/feedback.service";
import {TaskListService} from "../../services/task-list.service";
import {ActivityReportService} from "../../services/activity-report.service";
import {OngoingTask} from "../../models/ongoing-task";
import {UsersService} from "../../services/users.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private referralsService: ReferralsService,
    private feedbackService: FeedbackService,
    private taskListService: TaskListService,
    private activityReportService: ActivityReportService,
    private usersService: UsersService,
  ) {
  }

  entries: number = 10;

  rows: OngoingTask[];
  temp: OngoingTask[];
  referrals: OngoingTask[];
  feedback: OngoingTask[];
  quarterly_report: OngoingTask[];
  activity_report: OngoingTask[];
  isReferrals: boolean;
  isFeedback: boolean;
  isQuarterlyReport: boolean;
  isActivityReport: boolean;

  taskListRows: any = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.reloadTable(true);

    this.dtOptions = {
      pagingType: "numbers",
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      processing: true,
      responsive: true,
      dom: 'lfBrtip',
      buttons: [
        {
          text: '<i class="fas fa-file-csv" style="color: green;"></i>&nbsp;&nbsp;Export to CSV',
          extend: 'csvHtml5',
          title: 'TaskList'
        },
        {
          text: '<i class="far fa-file-excel" style="color: green;"></i>&nbsp;&nbsp;Export to Excel',
          extend: 'excelHtml5',
          title: 'TaskList'
        }
      ]
    };
  }

  switchRowsData(type: string) {
    this.isReferrals = false;
    this.isFeedback = false;
    this.isQuarterlyReport = false;
    this.isActivityReport = false;
    switch (type) {
      case 'referrals':
        this.isReferrals = true;
        this.rows = this.referrals;
        this.temp = [...this.referrals];
        break;
      case 'feedback':
        this.isFeedback = true;
        this.rows = this.feedback;
        this.temp = [...this.feedback];
        break;
      case 'quarterly_report':
        this.isQuarterlyReport = true;
        this.rows = this.quarterly_report;
        this.temp = [...this.quarterly_report];
        break;
      case 'activity_report':
        this.isActivityReport = true;
        this.rows = this.activity_report;
        this.temp = [...this.activity_report];
        break;
    }
  }

  entriesChange($event) {
    this.entries = $event.target.value;
    this.reloadTable();
  }

  reloadTable(firstTime? : boolean) {
    this.taskListService.getTaskList().subscribe(data => {
      console.log('data', data)
      let results1 = [];
      let results2 = [];
      let results3 = [];
      let results4 = [];
      if (data != null) {
        data.forEach((item) => {
          let staff = this.getStaff(item.partnerId);
          if(item.processDefKey=="QUATERLY_REPORTING") results1.push(this.getRow(staff ? staff.name : '', item.taskDefinitionKey, item.processDefKey,item.startDate, item.dateCreated, item.dateCreated))
          if(item.processDefKey=="IRC_REFERRAL") results2.push(this.getRow(staff ? staff.name : '', item.taskDefinitionKey, item.processDefKey,item.startDate, item.dateCreated, item.dateCreated))
          if(item.processDefKey=="ACTIVITY_REPORTING") results3.push(this.getRow(staff ? staff.name : '', item.taskDefinitionKey, item.processDefKey,item.startDate, item.dateCreated, item.dateCreated))
          if(item.processDefKey=="IRC_FEEDBACK") results4.push(this.getRow(staff ? staff.name : '', item.taskDefinitionKey, item.processDefKey,item.startDate, item.dateCreated, item.dateCreated))
        });
      }
      this.quarterly_report = results1;
      this.referrals = results2;
      this.activity_report = results3;
      this.feedback = results4;

      if(firstTime==true) this.switchRowsData('referrals');
      this.taskListRows = data;
      this.dtTrigger.next();
    });
  }

  getRow(assignee, taskName, type, dateAssigned, dateCreated, startDate): OngoingTask {
    return (
      {
        assignee: assignee,
        task_name: taskName,
        task_type: type,
        date_assigned: dateAssigned,
        date_created: dateCreated,
        task_age: startDate
      }
    );
  }

  getStaff(id): any {
    this.usersService.getCurrentUserStaff(id).subscribe((results: any) => {
      if (results !== null && results !== undefined) {
        return results;
      }
    });
    return null
  }

  getReferralStats(data): any {
    let pending = data.filter(item => item.status == "Pending");
    let actioned = data.filter(item => item.status == "Actioned");
    return (
      {
        referralsAssigned: data.length,
        referralsActioned: actioned.length,
        referralsPending: pending.length,
        AverageTimeToCompleteReferral: 4,
      }
    );
  }

  onChangeSearch(event) {
    let val = event.target.value.toLowerCase();
    // update the rows
    this.rows = this.temp.filter(function (d) {
      for (const key in d) {
        if (d[key]?.toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  createActivityReport() {
    this.router.navigate(['activity-create']);
  }

  createFeedback() {
    this.router.navigate(['create-feedback']);
  }

  createReferral() {
    this.router.navigate(['generate-referral']);
  }

  onSearch(event) {
    this.reloadTable();
  }

}
