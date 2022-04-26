import { Component, OnInit } from '@angular/core';
import {ReferralsService} from "../../services/referrals.service";
import {FeedbackService} from "../../services/feedback.service";
import {TaskListService} from "../../services/task-list.service";
import {ActivityReportService} from "../../services/activity-report.service";

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
  ) { }

  entries: number = 10;

  rows: Object[];
  temp: Object[];
  referrals: any;
  feedback: any;
  quarterly_report: any;
  activity_report: any;

  ngOnInit(): void {
    this.reloadTable();
  }

  switchRowsData(type: string) {
    switch (type) {
      case 'referrals':
        this.rows = this.referrals;
        this.temp = [...this.referrals];
        break;
      case 'feedback':
        this.rows = this.feedback;
        this.temp = [...this.feedback];
        break;
      case 'quarterly_report':
        this.rows = this.quarterly_report;
        this.temp = [...this.quarterly_report];
        break;
      case 'activity_report':
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
      this.referrals = data;
      console.log('referrals', data)
    });
    this.feedbackService.getFeedback().subscribe((data) => {
      this.feedback = data;
      console.log('feedback', data)
    });
    this.taskListService.getTaskList().subscribe(data => {
      this.quarterly_report = data;
      console.log('quarterly_report', data)
    });
    this.activityReportService.getActivityReport().subscribe((data) => {
      this.activity_report = data;
      console.log("activity_report",data)
    });
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
