import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {v4 as uuid} from 'uuid';
import {WorkPlanService} from '../../services/work-plan-setup.service';
import {CellEdit, OnUpdateCell} from '../../helpers/cell-edit';
import {Location} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {DateSplitter} from '../../helpers/date-splitter';
import {HttpParams} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectMilestoneService} from '../../services/project-milestone.service';
import {Indicator} from '../../models/indicator';
import {AlertService} from '../../services/alert';
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'app-work-plan',
  templateUrl: './work-plan-setup.component.html',
  styleUrls: ['./work-plan-setup.component.css']
})
export class WorkPlanComponent implements OnInit, OnUpdateCell {

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  calendar: any = {};
  budget: any = [];
  totalQuarterlyPlanAmount: string;
  totalApprovedAmount: string;
  totalBudgetDisburse: string;
  totalDisbursement: string;
  startReportingCycle = false;
  quarterlyCommitment: any = [];
  currentStatus: any = {};
  indicators: Indicator[] = [];

  setup: any;
  indicatorForDisaggregation: Indicator;
  budgetForDisaggregation: any;
  organisationalInfo: any = [];
  listOfPartners: any = [];
  milestones: any = [];
  staffChosen: string;
  programChosen: string;
  workPlanId: string;

  openPopup: boolean;
  editing: boolean;
  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;
  showDisaggregation: boolean;
  showQuarterlyBudget: boolean;
  btn_id: string;
  orgChosen: any;

  periodItems = [
    {name: 'Monthly', value: 'month'},
    {name: 'Quarterly', value: 'quarter'},
    {name: 'Annually', value: 'annual'}
  ];

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

  constructor(private router: Router, private route: ActivatedRoute,
              private location: Location,
              private workPlanService: WorkPlanService,
              public authService: AuthService,
              private usersService: UsersService,
              private projectMilestoneService: ProjectMilestoneService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.editing = false;
    this.route.params
      .subscribe(p => {
        this.workPlanId = p['id'];
        if (this.workPlanId != undefined || this.workPlanId != null) {
          const params = new HttpParams().set('id', this.workPlanId);
          this.workPlanService.getWorkPlanRecord(params).subscribe(data => {
            this.editing = true;
            this.setWorkPlanInfo(data.setup);
            this.calendar = {
              periodType: data.setup.periodType,
              grantStartDate: data.setup.startDate,
              grantEndDate: data.setup.endDate,
              projectReportingStartDate: data.setup.reportingStartDate,
              projectReportingEndDate: data.setup.reportingEndDate,
              reportingCalender: this.getCalendarForSetup(data.setup.id)
            };
          }, error => console.log(error));
        }
      });

    if (this.workPlanId != undefined) {
      this.usersService.getUserStaffs().subscribe(data => {
        if (data !== null && data !== undefined) {
          this.listOfPartners = data;
        }
      });
    } else {
      this.usersService.getUsersWithoutWorkPlan().subscribe(data => {
        console.log(data);
        if (data !== null && data !== undefined) {
          this.listOfPartners = data;
        }
      });
    }

    this.setMilestones();
    this.dtOptions = {
      pagingType: 'numbers',
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'All']],
      processing: true,
      responsive: true,
      dom: 'lfBrtip',
      buttons: []
    };
  }

  setWorkPlanInfo(data) {
    this.setup = data;
    if (data !== null && data !== undefined) {
      const setupValues = JSON.parse(data.setupValues);
      this.staffChosen = data.staffId;
      this.startReportingCycle = data.startCycle == 'true';
      if (this.staffChosen != undefined) {
        this.onPartnerChange();
      }

      if (setupValues.quarterlyCommitment != undefined) {
        this.quarterlyCommitment = setupValues.quarterlyCommitment;
        this.quarterlyCommitment.forEach((data) => {
          let totalD = 0;
          if (this.quarterlyCommitment.some(x => x.id === data.id)) {
            this.quarterlyCommitment.forEach(function (item) {
              if (item.id === data.id) {
                item.commitment = data.commitment;
              }
              totalD += +item.commitment;
            });
          }
          this.totalDisbursement = totalD.toString();
        });
      }

      if (setupValues.budget != undefined) {
        this.budget = setupValues.budget;
        this.budget.forEach((data) => {
          this.updateQuarterlyPlanAmount(data.id, data.quarterlySpendingPlan);
          this.updateBudgetAmount(data.id, data.approvedAmount);
          this.updateBudgetDisburse(data.id, data.totalSpent);
        });
      }

      if (setupValues.currentStatus != undefined) {
        this.currentStatus = setupValues.currentStatus;
      }
      if (this.isValidJSONStr(setupValues.indicators)) {
        this.indicators = JSON.parse(setupValues.indicators);
      }
      console.log('this.indicators', this.indicators);
    }

    this.dtTrigger.next();
  }

  getCalendarForSetup(id): any {
    const reportingCalendar: { [key: string]: string }[] = [];
    const params = new HttpParams().set('setupId', id);
    this.workPlanService.getReportingCalendarByWorkPlanId(params).subscribe(data => {
      data.calendar.forEach((cal) => {
        reportingCalendar.push({
          id: cal.id,
          startDate: cal.startDate,
          endDate: cal.endDate,
          datePeriod: cal.period
        });
      });
    });
    return reportingCalendar;
  }

  generateCalendar(event) {
    if (this.quarterlyCommitment.length > 0 || this.indicators.length > 0 || this.budget.length > 0) {
      if (confirm('This action will clear the targets and disbursement entered')) {
        this.quarterlyCommitment = [];
        this.indicators = [];
        this.budget = [];
        this.calendarDates();
      }
    } else {
      this.calendarDates();
    }
  }

  calendarDates() {
    const startDate = this.calendar.projectReportingStartDate;
    const endDate = this.calendar.projectReportingEndDate;

    if (this.calendar.periodType == 'quarter') {
      // generate quarters
      this.calendar.reportingCalender = DateSplitter.genDatesInRange(startDate, endDate, false);
    } else if (this.calendar.periodType == 'month') {
      // generate quarters
      this.calendar.reportingCalender = DateSplitter.genDatesInRange(startDate, endDate, true);
    } else if (this.calendar.periodType == 'annual') {
      // generate two years
      const years = [];
      const months = DateSplitter.genDatesInRange(startDate, endDate, true);
      const numOfYears = Math.floor(months.length / 12);
      let countStart = 0;
      let countEnd = 0;
      for (let number = 1; number <= numOfYears; number++) {
        countStart = countEnd + (number - 1);
        countEnd = countStart + 11;
        years.push({
          'datePeriod': 'Y' + number,
          'startDate': months[countStart].startDate,
          'endDate': months[countEnd].endDate,
        });
      }
      this.calendar.reportingCalender = years;
    }

    // set disbursement
    this.calendar.reportingCalender.forEach((period) => {
      this.quarterlyCommitment.push(
        {
          id: uuid(),
          datePeriod: period.datePeriod,
          startDate: period.startDate,
          endDate: period.endDate,
          commitment: ''
        }
      );
    });
    if (this.setup != undefined) {
      this.saveReportingCalendar(this.setup.id);
    }
  }

  onPartnerChange() {
    if (this.staffChosen != undefined) {
      this.usersService.getCurrentUserStaff(this.staffChosen).subscribe((results: any) => {
        if (results !== null && results !== undefined) {
          this.organisationalInfo = results;
          console.log(this.organisationalInfo)
          this.programChosen = results.programId;
          // if (this.programChosen != undefined) {
            // this.setMilestones(this.programChosen);
          // }
        }
      });
    }
  }

  setMilestones() {
    // const params = new HttpParams().set('program', program);
    this.projectMilestoneService.getMilestones().subscribe((data) => {
      if (data !== null && data !== undefined) {
        console.log('milestones', data.milestones);
        this.milestones = data.milestones;
      }
    });
  }

  setMilestoneDisaggregation(rowId) {
    if (this.indicators.some(x => x.id === rowId)) {
      this.indicators.forEach((item) => {
        this.calendar.reportingCalender.forEach((c) => {
          let exists = false;
          if (item.disaggregation.some(x => x.datePeriod === c.datePeriod)) {
            exists = true;
          }
          if (!exists) {
            item.disaggregation.push(
              {
                datePeriod: c.datePeriod,
                target: ''
              }
            );
          }
        });
      });
    }
  }

  setBudgetDisaggregation(rowId) {
    if (this.budget.some(x => x.id === rowId)) {
      this.budget.forEach((item) => {
        this.calendar.reportingCalender.forEach((c) => {
          let exists = false;
          if (item.quarterlyBudget.some(x => x.datePeriod === c.datePeriod)) {
            exists = true;
          }
          if (!exists) {
            item.quarterlyBudget.push(
              {
                datePeriod: c.datePeriod,
                amount: ''
              }
            );
          }
        });
      });
    }
  }

  toggleDisaggregation(btn_id, data) {
    this.showDisaggregation = !this.showDisaggregation;
    this.openPopup = this.showDisaggregation;
    this.btn_id = btn_id;
    const button = (document.getElementById(btn_id) as HTMLButtonElement);

    const minus_icon = document.createElement('i');
    minus_icon.classList.add('text', 'fas', 'fa-minus');
    minus_icon.style.fontSize = '20px';
    minus_icon.style.color = 'red';

    const plus_icon = document.createElement('i');
    plus_icon.classList.add('text', 'fas', 'fa-plus');
    plus_icon.style.fontSize = '20px';

    if (this.showDisaggregation) {
      button.firstChild.replaceWith(minus_icon);
      // set disaggregation values
      this.indicatorForDisaggregation = data;
    } else {
      button.firstChild.replaceWith(plus_icon);
    }
  }

  toggleQuarterly(btn_id, data) {
    this.showQuarterlyBudget = !this.showQuarterlyBudget;
    this.openPopup = this.showQuarterlyBudget;
    this.btn_id = btn_id;
    const button = (document.getElementById(btn_id) as HTMLButtonElement);

    const minus_icon = document.createElement('i');
    minus_icon.classList.add('text', 'fas', 'fa-minus');
    minus_icon.style.fontSize = '20px';
    minus_icon.style.color = 'red';

    const plus_icon = document.createElement('i');
    plus_icon.classList.add('text', 'fas', 'fa-plus');
    plus_icon.style.fontSize = '20px';

    if (this.showQuarterlyBudget) {
      button.firstChild.replaceWith(minus_icon);
      // set disaggregation values
      this.budgetForDisaggregation = data;
    } else {
      button.firstChild.replaceWith(plus_icon);
    }
  }

  createNewIndicator() {
    if (this.calendar.reportingCalender == undefined) {
      alert('No Calendar dates, Fill in reporting calendar');
      return;
    }

    if (this.milestones == undefined || this.milestones.length == 0) {
      alert('No Milestones found, Select Staff to proceed');
      return;
    }

    const id = uuid();
    this.indicators.push({id: id, name: '', milestoneId: '', overallTarget: '', disaggregation: [], startDate: '', endDate: ''});
  }

  createNewBudgetItem() {
    const id = uuid();
    this.budget.push({id: id, budgetLine: '', approvedAmount: '', totalSpent: '', quarterlyBudget: []});
    this.setBudgetDisaggregation(id);
  }

  removeIndicator(indicator: Indicator) {
    this.indicators = this.indicators.filter(item => item.id != indicator.id);
  }

  removeBudget(row) {
    this.budget = this.budget.filter(item => item.id != row.id);
  }

  cellEditor(rowId, tdId, key: string, oldValue, type?: string, selectList?: any[]) {
    new CellEdit().edit(rowId, tdId, oldValue, key, this.saveCellValue, type, '', selectList);
  }

  saveCellValue = (value: string, key: string, rowId, extras): void => {
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
        case 'quartery_budget':
          let amt = 0;
          const array = rowId.split(' ');
          const period = array[0];
          const budgetId = array[1];
          this.budget.forEach((item) => {
            if (item.id === budgetId) {
              if (item.quarterlyBudget.some(x => x.datePeriod === period)) {
                item.quarterlyBudget.forEach(function (item) {
                  if (item.datePeriod === period) {
                    item.amount = value;
                  }
                  if (item.amount.length != 0) {
                    amt += +item.amount;
                  }
                });
                item.quarterlySpendingPlan = amt.toString();
                this.budgetForDisaggregation = item;
              }
            }
          });
          this.updateQuarterlyCommitmentValues(period, value, extras);
          break;
        case 'total_spent':
          this.updateBudgetDisburse(rowId, value, true);
          break;
        case 'disaggregation':
          let overallTarget = 0;
          const arr = rowId.split(' ');
          const datePeriod = arr[0];
          const indicatorId = arr[1];
          this.indicators.forEach((indicator) => {
            if (indicator.id === indicatorId) {
              if (indicator.disaggregation.some(x => x.datePeriod === datePeriod)) {
                indicator.disaggregation.forEach(function (item) {
                  if (item.datePeriod === datePeriod) {
                    item.target = value;
                  }
                  if (item.target.length != 0) {
                    overallTarget += +item.target;
                  }
                });
                indicator.overallTarget = overallTarget.toString();
                this.indicatorForDisaggregation = indicator;
              }
            }
          });
          break;
        case 'indicators':
          if (this.indicators.some(x => x.id === rowId)) {
            this.indicators.forEach((item) => {
              if (item.id === rowId) {
                item.name = value;
                item.milestoneId = extras;
              }
            });
          }
          this.setMilestoneDisaggregation(rowId);
          break;
        case 'startDate':
          if (this.indicators.some(x => x.id === rowId)) {
            this.indicators.forEach((item) => {
              if (item.id === rowId) {
                item.startDate = value;

              }
            });
          }
          break;
        case 'endDate':
          if (this.indicators.some(x => x.id === rowId)) {
            this.indicators.forEach((item) => {
              if (item.id === rowId) {
                item.endDate = value;
              }
            });
          }
          break;
      }
    }
    this.savePlan();
  }

  savePlan(done?: boolean) {
    this.error = false;
    this.success = false;

    console.log('this.indicators', this.indicators);
    const values: { [key: string]: string } = {
      indicators: JSON.stringify(this.indicators),
      budget: this.budget,
      quarterlyCommitment: this.quarterlyCommitment,
      currentStatus: this.currentStatus
    };

    const workPlanRecord: { [key: string]: string } = {
      userId: this.authService.getLoggedInUsername(),
      staffId: this.staffChosen,
      programId: this.programChosen,
      organization: this.orgChosen,
      setupValues: JSON.stringify(values),
      startDate: this.calendar.grantStartDate,
      endDate: this.calendar.grantEndDate,
      reportingStartDate: this.calendar.projectReportingStartDate,
      reportingEndDate: this.calendar.projectReportingEndDate,
      periodType: this.calendar.periodType,
      startCycle: '' + this.startReportingCycle,
    };

    if (this.setup) {
      this.workPlanService.updateWorkPlan(workPlanRecord, this.setup.id).subscribe((data) => {
        this.setWorkPlanInfo(data);
        this.error = false;
        this.success = true;
        this.successMessage = 'Updated Work Plan';
      }, error => {
        this.error = true;
        this.errorMessage = 'Failed to update Work Plan';
        this.success = false;
        console.log(error);
      });
    } else {
      this.workPlanService.createWorkPlan(workPlanRecord).subscribe((data) => {
        if (data !== null && data !== undefined) {
          this.saveReportingCalendar(data.id);
        }
        this.setWorkPlanInfo(data);
        this.error = false;
        this.success = true;
        this.successMessage = 'Saved Work Plan';
      }, error => {
        this.error = true;
        this.errorMessage = 'Failed to save Work Plan';
        this.success = false;
        console.log(error);
      });
    }

    setTimeout(() => {
      if (done == true && this.success) {
        this.onBackPressed();
      }
      this.success = false;
      this.error = false;
    }, 3000);
  }

  saveReportingCalendar(setupId) {
    const values: { [key: string]: any }[] = [];
    this.calendar.reportingCalender.forEach((c) => {
      values.push({
        startDate: c.startDate,
        endDate: c.endDate,
        period: c.datePeriod,
        workPlanId: setupId,
        started: false,
        completed: false
      });
    });

    if (values.length != 0) {
      this.workPlanService.deleteReportingCalendarForPartner(setupId).subscribe((data) => {
        values.forEach((value) => {
          this.workPlanService.createReportingCalendar(value).subscribe((data) => {
            if (this.calendar.reportingCalender.some(x => x.id === data.id)) {
              this.calendar.reportingCalender.forEach(function (item) {
                if (item.id === data.id) {
                  item.startDate = data.startDate;
                  item.endDate = data.endDate;
                  item.datePeriod = data.period;
                }
              });
            }
          }, error => {
            console.log(error);
          });
        });
      }, error => {
        console.log(error);
      });
    }
  }

  isValidJSONStr(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  onBackPressed() {
    this.location.back();
  }

  private updateBudgetAmount(id, newValue) {
    let total = 0;
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

  private updateQuarterlyPlanAmount(id, newValue) {
    let total = 0;
    if (this.budget.some(x => x.id === id)) {
      this.budget.forEach(function (item) {
        if (item.id === id) {
          item.quarterlySpendingPlan = newValue;
        }
        total += +item.quarterlySpendingPlan;
      });
    }
    this.totalQuarterlyPlanAmount = total.toString();
  }

  private updateBudgetDisburse(id, newValue, editing?: boolean) {
    let total = 0;
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
    this.currentStatus.totalAmountSpent = total;
  }

  private updateQuarterlyCommitmentValues(period, newValue, oldValue) {
    let totalD = 0;
    this.quarterlyCommitment.forEach((item) => {
      if (item.datePeriod === period) {
        console.log('oldValue', oldValue.length > 0);
        if (oldValue.length > 0) {
          if (this.budget.length > 1) {
            // adding new record
            //  this is basic mathematics. answer = commitment - oldvalue
            //  newCommitment = answer + newValue
            let answer = +item.commitment - +oldValue;
            item.commitment = +newValue + answer;
          } else {
            item.commitment = newValue;
          }
        } else {
          // adding new record
          item.commitment = (+item.commitment + +newValue);
        }
      }
      totalD += +item.commitment;
    });
    this.totalDisbursement = totalD.toString();
    this.currentStatus.totalAmountCommitted = totalD;
  }
}
