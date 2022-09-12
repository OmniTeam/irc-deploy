import {Component, OnInit} from '@angular/core';
import {ReferralsService} from '../../services/referrals.service';
import {FeedbackService} from '../../services/feedback.service';
import {TaskListService} from '../../services/task-list.service';
import {ActivityReportService} from '../../services/activity-report.service';
import {OngoingTask} from '../../models/ongoing-task';
import {UsersService} from '../../services/users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DateAgoPipe} from '../../pipes/date-ago.pipe';
import {WorkPlanService} from '../../services/work-plan-setup.service';
import {ReportFormService} from '../../services/report-form.service';
import {ProgramCategoryService} from '../../services/program-category.service';

@Component({
  selector: 'app-home',
  templateUrl: './ongoing-tasks.component.html',
  styleUrls: ['./ongoing-tasks.component.css']
})
export class OngoingTasksComponent implements OnInit {
  indicators: any;
  displayMilestones: any[];
  overallTarget: any[];
  active_div = '';
  perc: any;
  barColor: any;
  displayRows: OngoingTask[];
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private referralsService: ReferralsService,
    private feedbackService: FeedbackService,
    private taskListService: TaskListService,
    private activityReportService: ActivityReportService,
    private workPlanService: WorkPlanService,
    private reportFormService: ReportFormService,
    private usersService: UsersService,
    private programCategory: ProgramCategoryService
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
  milestones: any;

  filterCounter: { filter: string, count: number }[] = [];
  filters = [
    {name: '0 to 1 Week'},
    {name: '1 to 2 Week'},
    {name: '3 to 4 Week'},
    {name: 'More than 4 Weeks'},
    {name: 'All'},
  ];
  taskListRows: OngoingTask[];
  budgetHolders: any;
  progress: any;

  ngOnInit(): void {
    this.reloadTable(true);
    this.getMilestones();
    this.getBudgetLines();
    this.getProgramCategories();
    //load filter counts
    this.filters.forEach((filter) => {
      this.setFilters(filter, true);
    });
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

  reloadTable(firstTime?: boolean) {
    this.isLoading = true;
    this.taskListService.getTaskList().subscribe(data => {
      let results = [];
      let results1 = [];
      let results2 = [];
      let results3 = [];
      let results4 = [];
      if (data != null) {
        data.forEach((item) => {
          let staff = this.getStaff(item.staffId);
          results.push(this.getRow(item.id, staff ? staff.name : item.assignee, item.taskDefinitionKey, item.processDefKey, item.startDate, item.case));
          if (item.processDefKey == 'PROGRESS_REPORTING') {
            results1.push(this.getRow(item.id, staff ? staff.name : item.assignee, item.taskDefinitionKey, item.processDefKey, item.startDate, item.case));
          }
          if (item.processDefKey == 'IRC_REFERRAL') {
            results2.push(this.getRow(item.id, staff ? staff.name : item.assignee, item.taskDefinitionKey, item.processDefKey, item.startDate, item.case));
          }
          if (item.processDefKey == 'ACTIVITY_REPORTING') {
            results3.push(this.getRow(item.id, staff ? staff.name : item.assignee, item.taskDefinitionKey, item.processDefKey, item.startDate, item.case));
          }
          if (item.processDefKey == 'IRC_FEEDBACK') {
            results4.push(this.getRow(item.id, staff ? staff.name : item.assignee, item.taskDefinitionKey, item.processDefKey, item.startDate, item.case));
          }
        });
      }
      this.taskListRows = results;
      this.quarterly_report = results1;
      this.referrals = results2;
      this.activity_report = results3;
      this.feedback = results4;

      if (firstTime == true) {
        this.switchRowsData('referrals');
      }
      this.isLoading = false;
    }, error => {
      console.log(error)
      this.isLoading = false;
    });
  }

  clickReset() {
    this.active_div = ''
    this.getMilestones()
  }

  getProgramCategories() {
    this.programCategory.getProgramCategories().subscribe((data) => {
      console.log('Categories', data);
      this.progress = data;
    });
  }

  getMilestones() {
    this.reportFormService.getMilestonePerformance().subscribe((data) => {
      let milestones = [];
      this.milestones = data;
      console.log('Mile', data);
      if (this.milestones != null) {
        this.milestones.forEach((d) => {
          milestones.push(this.getMile(d.milestone, d.overallTarget, d.cumulativeAchievement, d.percentageAchievement,
            d.approvedBudget, d.expenseToDate, '', d.endDate, d.startDate, ''));
        });
        this.displayMilestones = milestones;

      }
    });
  }

  getBudgetLines() {
    this.workPlanService.getWorkPlan().subscribe((data) => {
      console.log(data);
      this.budgetHolders = data;
    });
  }

  filterMilestonesList(event) {
    let staffId = event;
    let staffMilestones = [];
    this.milestones.forEach((d) => {
      if (d.staffId === staffId) {
        staffMilestones.push(this.getMile(d.milestone, d.overallTarget, d.cumulativeAchievement,
          d.percentageAchievement, d.approvedBudget, d.expenseToDate, '', d.endDate, d.startDate, ''));
        console.log(d);
      }
    });
    this.displayMilestones = staffMilestones;
  }

  getRow(id, assignee, taskName, type, dateAssigned, taskCase): OngoingTask {
    let taskAge = new DateAgoPipe().transform(dateAssigned);
    let filterCategory = this.setFilterCategory(taskAge);
    return (
      {
        id: id,
        assignee: assignee,
        task_name: taskName,
        task_case: taskCase,
        task_type: type,
        date_assigned: dateAssigned,
        task_age: taskAge,
        filter_category: filterCategory
      }
    );
  }

  getMile(milestone: any, target: any, cumulative: any, achievement: any, budget: string, expenses: string, efficiency: string, endDate: string, startDate: string, progress: any) {
    return (
      {
        milestone: milestone,
        target: target,
        cumulative: cumulative,
        achievement: this.getEfficiency(target, cumulative),
        budget: budget,
        expenses: expenses,
        startDate: startDate,
        endDate: endDate,
        efficiency: this.getEfficiency(budget, expenses),
        progress: this.getRowProgress(startDate, endDate, target, cumulative)
      }
    );

  }

  getEfficiency(budget, expenses) {
    if (!isNaN(Math.round((expenses / budget) * 100))) {
      return Math.round((expenses / budget) * 100);
    } else {
      return 0;
    }

  }

  setCardFilter(event) {
    // //switch case
    // this.isReferrals = false;
    // this.isFeedback = false;
    // this.isQuarterlyReport = false;
    // this.isActivityReport = false;
    switch (event) {
      case 'referrals':
        this.taskListRows = this.referrals
        break;
      case 'feedback':
        this.taskListRows = this.feedback;
        break;
      case 'quarterly_report':
        this.isQuarterlyReport = true;
        this.taskListRows = this.quarterly_report;
        break;
      case 'activity_report':
        this.taskListRows = this.activity_report;
        break;
    }

  }

  getRowProgress(start: any, end: any, target, achieved) {
    //calculate the days days between
    const startDate = new Date(start);
    const endDate = new Date(end);

    // @ts-ignore
    const diffInMs = Math.abs(endDate - startDate);
    let diff = diffInMs / (1000 * 60 * 60 * 24);

    let daily = Math.round(target / diff);
    let today = new Date();
    // @ts-ignore
    const currentTime = Math.abs(today - startDate);
    let newDays = Math.round(currentTime / (1000 * 60 * 60 * 24));

    let expected = daily * newDays;

    if (achieved <= expected) {
      return 'Slow Progress';
    } else if (achieved > expected) {
      return 'Within Time';
    } else {
      return 'Late';
    }

    //   console.log("my date",startDate);
    //   let diff =  Math.abs(endDate - startDate)
    //
    //   console.log(diff);
    // return diff

  }

  getRowClass = (row, column, value) => {
    return {
      'row-color2': value === 'Slow Progress',
      'row-color1': value === 'Within Time',
      'row-color3': value === 'Late'
    };
  };

  getStaff(id): any {
    this.usersService.getCurrentUserStaff(id).subscribe((results: any) => {
      if (results !== null && results !== undefined) {
        return results;
      }
    });
    return null;
  }

  getReferralStats(data): any {
    let pending = data.filter(item => item.status == 'Pending');
    let actioned = data.filter(item => item.status == 'Actioned');
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

  openForm(processDefKey: any, row) {
    switch (processDefKey) {
      case 'IRC_REFERRAL':
        this.router.navigate(['/action-referral/' + row.id+ '/' + row.id + false]);
        break;
      case 'PROGRESS_REPORTING':
        this.router.navigate(['/progress-report/' + row.id + '/' + row.id + '/' + row.id + '/' + false]);
        break;
      case 'IRC_FEEDBACK':
        this.router.navigate(['/action-feedback/' + row.id+ '/' + false]);
        break;
      case 'ACTIVITY_REPORTING':
        this.router.navigate(['/activityForm/' + row.id + '/' + row.id + '/' + false]);
        break;
    }
  }

  setFilterCategory(taskAge: string) {
    let filterCategory: any;
    if (taskAge.includes('week')) {
      filterCategory = {period: 'week', duration: taskAge.charAt(0)};
    } else if (taskAge.includes('month')) {
      filterCategory = {period: 'month', duration: taskAge.charAt(0)};
    } else if (taskAge.includes('year')) {
      filterCategory = {period: 'year', duration: taskAge.charAt(0)};
    }
    return filterCategory;
  }

  setFilters(filter, firstTime?: boolean) {
    this.taskListService.getTaskList().subscribe(data => {
      let results = [];
      let rts = [];
      if (data != null) {
        data.forEach((item) => {
          let staff = this.getStaff(item.staffId);
          rts.push(this.getRow(item.id, staff ? staff.name : item.assignee, item.taskDefinitionKey, item.processDefKey, item.startDate, item.case));
        });
        rts.forEach((task) => {
          if (task.filter_category != undefined) {
            if (filter.name == 'More than 4 Weeks') {
              if (task.filter_category.period == 'month' || task.filter_category.period == 'year') {
                results.push(task);
              }
              this.filterCount(filter, results.length);
            } else if (filter.name == '0 to 1 Week') {
              if (task.filter_category.period == 'week' && task.filter_category.duration <= 1) {
                results.push(task);
              } else if (task.filter_category.period == 'day') {
                results.push(task);
              }
              this.filterCount(filter, results.length);
            } else if (filter.name == '1 to 2 Week') {
              if (task.filter_category.period == 'week' && task.filter_category.duration >= 1 && task.filter_category.duration <= 2) {
                results.push(task);
              }
              this.filterCount(filter, results.length);
            } else if (filter.name == '3 to 4 Week') {
              if (task.filter_category.period == 'week' && task.filter_category.duration >= 3 && task.filter_category.duration <= 4) {
                results.push(task);
              }
              this.filterCount(filter, results.length);
            }
          }
        });
        if (firstTime != true) {
          this.taskListRows = results;
        }
      }
    });

    if (filter.name == 'All') {
      this.reloadTable();
    }
  }

  filterCount(filter, count: number) {
    if (this.filterCounter.some(x => x.filter === filter.name)) {
      this.filterCounter.forEach((item) => {
        if (item.filter == filter.name) {
          item.count = count;
        }
      });
    } else {
      this.filterCounter.push({filter: filter.name, count: count});
    }
  }

  getNumberOfRecordsForFilter(filterName): number {
    let number = 0;
    this.setProgressColor(filterName)
    this.filterCounter.forEach((item) => {
      if (item.filter == filterName) {
        number = item.count;
        this.perc = Math.round((number / this.taskListRows?.length) * 100)
      }
    });
    if (filterName == 'All') {
      number = this.taskListRows?.length;
      this.barColor === 'red'
      this.perc = 0
    }
    return number;
  }

  setProgressColor(filter): any {
    this.filterCounter.forEach((item) => {
      if (item.filter == '0 to 1 Week') {
        this.barColor = 'primary'
      } else if (item.filter == '1 to 2 Week') {
        this.barColor == 'success'
      } else if (item.filter == '3 to 4 Week') {
        this.barColor = 'info'
      } else if (item.filter == 'More than 4 Weeks') {
        this.barColor == 'danger'
      }
    })

    return this.barColor
  }


  filterOutcomeList(event) {
    let catId = event;
    let staffMilestones = [];
    this.milestones.forEach((d) => {
      if (d.categoryId === catId) {
        staffMilestones.push(this.getMile(d.milestone, d.overallTarget, d.cumulativeAchievement,
          d.percentageAchievement, d.approvedBudget, d.expenseToDate, '', d.endDate, d.startDate, ''));
        console.log(d);
      }
    });
    this.displayMilestones = staffMilestones
  }

  //filter table with cards

  clickWithinTime(progress) {
    this.active_div = 'clickActioned'
    let newFilter = [];
    this.displayMilestones.filter((a) => {
      if (a.progress != undefined && a.progress === progress) {
        newFilter.push(this.getMile(a.milestone, a.overallTarget, a.cumulativeAchievement,
          a.percentageAchievement, a.approvedBudget, a.expenseToDate, '', a.endDate, a.startDate, ''))
      }
    });
    console.log(newFilter);
    this.displayMilestones = newFilter
  }
}
