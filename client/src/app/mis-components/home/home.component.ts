import {Component, OnInit} from '@angular/core';
import {ReferralsService} from "../../services/referrals.service";
import {FeedbackService} from "../../services/feedback.service";
import {TaskListService} from "../../services/task-list.service";
import {ActivityReportService} from "../../services/activity-report.service";
import {OngoingTask} from "../../models/ongoing-task";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
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

  ngOnInit(): void {
    this.isReferrals = true;
    this.reloadTable();
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

  reloadTable() {
    this.referralsService.getReferrals().subscribe((data) => {
      console.log('referrals', data)
      let results = [];
      if (data != null) {
        this.getReferralStats(data);
        data.forEach((item) => {
          results.push(this.getRow(item.assignee, 'Referral', item.reasonForReferral, item.dateCreated, item.dateOfReferral))
        });
      }
      this.referrals = results;
    });
    this.feedbackService.getFeedback().subscribe((data) => {
      console.log('feedback', data)
      let results = [];
      if (data != null) {
        data.forEach((item) => {
          results.push(this.getRow(item.assignee, 'Action Feedback', item.typeOfFeedback, item.dateCreated, item.startDate))
        });
      }
      this.feedback = results;
    });
    this.taskListService.getTaskList().subscribe(data => {
      console.log('reporting', data)
      let results = [];
      if (data != null) {
        data.forEach((item) => {
          let staff = this.getStaff(item.partnerId);
          results.push(this.getRow(staff ? staff.name : '', item.taskName, 'Reporting', item.dateCreated, item.startDate))
        });
      }
      this.quarterly_report = results;
    });
    this.activityReportService.getActivityReport().subscribe((data) => {
      console.log('activity_report', data)
      let results = [];
      if (data != null) {
        data.forEach((item) => {
          let staff = this.getStaff(item.assignee);
          results.push(this.getRow(staff ? staff.name : '', item.name, 'Activity Report', item.dateCreated, item.startDate))
        });
      }
      this.activity_report = results;
    });
  }

  getRow(assignee, taskName, type, dateAssigned, startDate): OngoingTask {
    return (
      {
        assignee: assignee,
        task_name: taskName,
        task_type: type,
        date_assigned: dateAssigned,
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

  onSearch(event) {
    this.reloadTable();
  }

}
