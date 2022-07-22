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
import {log} from 'util';
import {HttpParams} from "@angular/common/http";
import {ProjectMilestoneService} from "../../services/project-milestone.service";
import {getElement} from "devextreme-angular";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  indicators: any;
  displayMilestones: any[];
  overallTarget: any[];
  active_div = '';
  perc: any;
  barColor: any;
  withinTime: number;
  slowProgress: number;
  lateProgress: number;
  withinBudget: number;
  beyondBudget: number;
  noBudget: number;

  irc_list = [
    {
      'name': 'IRC'
    },
    {
      'name': 'Relon'
    },
    {
      'name': 'Plavu'
    },
    {
      'name': 'Raising Gabdho Foundation'
    },
    {
      'name': 'Makasi Rescue Foundation'
    },
  ];
  pillars: any;
  acceptable: number;
  average: number;
  under: number;


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
    private programCategory: ProgramCategoryService,
    private projectMilestoneService: ProjectMilestoneService,
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
    this.getPillars()
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
    });
  }

  clickReset() {
    this.active_div=''
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
      console.log('Milestones', data);
      if (this.milestones != null) {
        this.milestones.forEach((d) => {
          milestones.push(this.getMile(d.milestone, d.overallTarget, d.achievement,
            d.achievement, d.approvedBudget, d.expenseToDate, d.efficiency, d.endDate, d.startDate, d.progress,d.budgetEfficiency,d.percentage));
        });
        this.displayMilestones = milestones;
        console.log('Milestones Display', this.displayMilestones);
        this.cardsData()
      }
    });
  }


  getBudgetLines() {
    this.workPlanService.getWorkPlan().subscribe((data) => {
      console.log(data);
      this.budgetHolders = data;
    });
  }


  getPillars(){
    this.projectMilestoneService.getPrograms().subscribe((data) => {
      console.log(data);
      this.pillars = data;
    });
  }

  filterPillar(program) {
    let pillar = program;
    let staffMilestones = [];
    this.milestones.forEach((d) => {
      if (d.pillar === pillar) {
        staffMilestones.push(this.getMile(d.milestone, d.overallTarget, d.achievement,
          d.achievement, d.approvedBudget, d.expenseToDate, d.efficiency, d.endDate, d.startDate, d.progress,d.budgetEfficiency,d.percentage));
      }
    });
    this.displayMilestones = staffMilestones;
    this.cardsData()
  }

  filterMilestonesList(event) {
    let staffId = event;
    let staffMilestones = [];
    this.milestones.forEach((d) => {
      if (d.staffId === staffId) {
        staffMilestones.push(this.getMile(d.milestone, d.overallTarget, d.achievement,
          d.achievement, d.approvedBudget, d.expenseToDate, d.efficiency, d.endDate, d.startDate, d.progress,d.budgetEfficiency,d.percentage));
      }
    });
    this.displayMilestones = staffMilestones;
    this.cardsData()
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

  getMile(milestone: any, target: any, cumulative: any, achievement: any, budget: number, expenses: number, efficiency: string, endDate: string, startDate: string, progress: any, budgetEfficiency: string,percentage:any) {
    return (
      {
        milestone: milestone,
        target: target,
        cumulative: cumulative,
        achievement: achievement,
        budget: Math.round((budget/4100)),
        expenses: Math.round((expenses/4100)),
        startDate: startDate,
        endDate: endDate,
        efficiency: efficiency,
        progress: progress,
        budgetEfficiency: budgetEfficiency,
        percentage: percentage,
      }
    );

  }

  // achievement: 31
  // approvedBudget: "61159700"
  // budgetEfficiency: "Over Spent"
  // categoryId: "d0a0bc17-907a-4029-84c0-e0a3447392ba"
  // achievement: 71
  // efficiency: 83
  // endDate: "2022-12-31"
  // expenseToDate: "51050000"
  // milestone: "On the job trainings & apprenticeships"
  // milestoneId: "e56e1a12-efb8-4c47-a1f7-821959752e86"
  // organization: null
  // overallTarget: "230"
  // percentage: "Under Performance"
  // pillar: "27b9f266-bdaf-4d5e-8edf-095918df4b12"
  // progress: "Late"
  // staffId: "8ad02646-2903-4a49-a960-f8a37a4749c9"
  // startDate: "2022-01-01"


  getEfficiency(budget: number, expenses: number) {
    if (!isNaN(Math.round((expenses / budget) * 100))) {
      return Math.round((expenses / budget) * 100);
    } else {
      return 0;
    }

  }

  //target vs Time
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

    if (achieved >= expected * 0.5 && achieved <= expected * 0.7) {
      return 'Slow Progress';
    } else if (achieved > expected * 0.7) {
      return 'Good Progress';
    } else {
      return 'Late';
    }
  }

  //budget vs Target
  getBudgetProgress(target, budget, spent, achieved) {
    //get amount per target
    let amountPerTarget = budget / target;
    //get actual performance
    let actualPerformance = spent / achieved;
    let calculatedPerformance = (actualPerformance * 100) / amountPerTarget;

    if(calculatedPerformance > 110 ){
      return 'Over Spend';
    } else if (calculatedPerformance >= 90 && calculatedPerformance <= 110) {
      return 'Good Burn Rate';
    } else if(calculatedPerformance > 50 && calculatedPerformance <= 89){
      return 'Fair Burn Rate';
    } else{
      return 'Low Burn Rate';
    }
  }

  //actual vs target
  getActualProgress(target, achieved) {
    let percentage = (achieved * 100) / target;
    if (percentage > 75) {
      return 'Acceptable Performance';
    } else if (percentage > 50 && percentage < 74) {
      return 'Average Performance';
    } else {
      return 'Under Performance';
    }
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
        this.router.navigate(['/action-referral/' + row.id]);
        break;
      case 'PROGRESS_REPORTING':
        this.router.navigate(['/progress-report/' + row.id + '/' + false]);
        break;
      case 'IRC_FEEDBACK':
        this.router.navigate(['/action-feedback/' + row.id]);
        break;
      case 'ACTIVITY_REPORTING':
        this.router.navigate(['/activityForm/' + row.id]);
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
        this.perc = Math.round((number/this.taskListRows?.length) * 100)
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
    this.filterCounter.forEach((item) =>{
      if(item.filter == '0 to 1 Week'){
        this.barColor = 'primary'
      } else if (item.filter == '1 to 2 Week'){
        this.barColor == 'success'
      } else if (item.filter == '3 to 4 Week'){
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
        staffMilestones.push(this.getMile(d.milestone, d.overallTarget, d.achievement,
          d.achievement, d.approvedBudget, d.expenseToDate, d.efficiency, d.endDate, d.startDate, d.progress,d.budgetEfficiency,d.percentage));
      }
    });
    this.displayMilestones = staffMilestones
    this.cardsData()
  }

  cardsData() {
    this.withinTime = this.displayMilestones.filter(a => a.progress.includes("Good Progress")).length;
    this.slowProgress = this.displayMilestones.filter(a => a.progress.includes("Slow Progress")).length;
    this.lateProgress = this.displayMilestones.filter(a => a.progress.includes("Late")).length;
    this.withinBudget = this.displayMilestones.filter(a => a.efficiency < 100).length;
    this.beyondBudget = this.displayMilestones.filter(a => a.efficiency > 100).length;
    this.noBudget = this.displayMilestones.filter(a => a.efficiency <= 0).length;
    this.acceptable = this.displayMilestones.filter(a => a.percentage.includes("Acceptable Performance")).length;
    this.average = this.displayMilestones.filter(a => a.percentage.includes("Average Performance")).length;
    this.under = this.displayMilestones.filter(a => a.percentage.includes("Under Performance")).length;
  }


  //filter table with cards
  backgroundColor: string

  getColor(achievement) {
    if(achievement >= 80 && achievement <= 100){
      return 'green'
    } else if (achievement < 80 && achievement >= 50){
      return 'orange'
    } else {
      return 'red'
    }
  }



  clickWithinTime(progress) {

    let newFilter = [];
    this.displayMilestones.filter((d) => {
      if (d.progress != undefined && d.progress.includes(progress)) {
        newFilter.push(this.getMile(d.milestone, d.overallTarget, d.achievement,
          d.achievement, d.approvedBudget, d.expenseToDate, d.efficiency, d.endDate, d.startDate, d.progress,d.budgetEfficiency,d.percentage))
      }
    });
    console.log(newFilter)
    this.displayMilestones = newFilter
  }

  clickPerformance(perf) {
    let newFilter = [];
    console.log("Display",this.displayMilestones)
    this.displayMilestones.filter((d) => {
      if (d.percentage != undefined && d.percentage.includes(perf)) {
        newFilter.push(this.getMile(d.milestone, d.overallTarget, d.achievement,
          d.achievement, d.approvedBudget, d.expenseToDate, d.efficiency, d.endDate, d.startDate, d.progress,d.budgetEfficiency,d.percentage))
      }
    });
    this.displayMilestones = newFilter
  }

  getColorProgress(prog){
    if(prog == 'Good Progress'){
      return 'green'
    } else if (prog == 'Slow Progress'){
      return 'orange'
    } else {
      return 'red'
    }
  }

  filterOrganizationList(event) {
    let org = event;
    let staffMilestones = [];
    this.milestones.forEach((d) => {
      if (d.organization === org) {
        staffMilestones.push(this.getMile(d.milestone, d.overallTarget, d.achievement,
          d.achievement, d.approvedBudget, d.expenseToDate, d.efficiency, d.endDate, d.startDate, d.progress,d.budgetEfficiency,d.percentage));
        console.log(d);
      }
    });
    this.displayMilestones = staffMilestones
    this.cardsData()
  }



  onChangeDate() {
    //get the date range by Id
    let startDate = document.getElementById('date') as HTMLInputElement;
    let endDate = document.getElementById('date2') as HTMLInputElement;


    let newDate = new Date(startDate.value);
    let newDate2 = new Date(endDate.value);
    // filter basing on dates if both are selected
    if (startDate.value != '' && endDate.value != '') {
      let newFilter = [];
      this.milestones.filter((d) => {
        let startDate = new Date(d.startDate);
        let endDate = new Date(d.endDate);
        if (startDate >= newDate && endDate <= newDate2) {
          newFilter.push(this.getMile(d.milestone, d.overallTarget, d.achievement,
            d.achievement, d.approvedBudget, d.expenseToDate, d.efficiency, d.endDate, d.startDate, d.progress,d.budgetEfficiency,d.percentage))
        }
      });
      this.displayMilestones = newFilter
    }

  }
}
