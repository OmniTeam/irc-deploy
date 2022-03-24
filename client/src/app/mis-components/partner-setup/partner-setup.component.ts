import {Component, OnInit, ViewChild} from '@angular/core';
import {SampleData} from "../../helpers/sample-data";
import {Subject} from "rxjs";
import {v4 as uuid} from 'uuid';
import {PartnerSetupService} from "../../services/partner-setup.service";
import {ProgramPartnersService} from "../../services/program-partners.service";
import {CellEdit, OnUpdateCell} from '../../helpers/cell-edit';
import {Location} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {DateSplitter} from '../../helpers/date-splitter';
import {HttpParams} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectMilestoneService} from "../../services/project-milestone.service";
import {Indicator} from "../../models/indicator";

@Component({
  selector: 'app-partner-setup',
  templateUrl: './partner-setup.component.html',
  styleUrls: ['./partner-setup.component.css']
})
export class PartnerSetupComponent implements OnInit, OnUpdateCell {

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  calendar: any = {};
  budget: any = [];
  totalApprovedAmount: string;
  totalDisbursement: string;
  disbursementPlan: any = [];
  currentStatus: any = {};
  indicators: Indicator[] = [];

  setup: any;
  indicatorForDisaggregation: Indicator;
  organisationalInfo: any = [];
  listOfPartners: any = [];
  milestones: any = [];
  partnerChosen: string;
  programChosen: string;
  partnerSetupId: string;

  openPopup: boolean;
  editing: boolean;
  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;
  showDisaggregation: boolean;
  btn_id: string;

  periodItems = [
    {name: 'Monthly', value: 'month'},
    {name: 'Quarterly', value: 'quarter'},
    {name: 'Annually', value: 'annual'}
  ];

  constructor(private router: Router, private route: ActivatedRoute,
              private location: Location,
              private partnerSetupService: PartnerSetupService,
              public authService: AuthService,
              private programPartnersService: ProgramPartnersService,
              private projectMilestoneService: ProjectMilestoneService) {
  }

  ngOnInit(): void {
    this.editing = false;
    this.route.params
      .subscribe(p => {
        this.partnerSetupId = p['id'];
        const params = new HttpParams().set('id', this.partnerSetupId);
        this.partnerSetupService.getPartnerSetupRecord(params).subscribe(data => {
          this.editing = true;
          this.setPartnerSetupInfo(data.setup);
        }, error => console.log(error));
      });

    this.programPartnersService.getProgramPartners().subscribe(data => {
      if (data !== null && data !== undefined) {
        this.listOfPartners = data;
      } /*else {
        this.listOfPartners = SampleData.partners;
      }*/
    });

    this.dtOptions = {
      pagingType: "numbers",
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
      processing: true,
      responsive: true,
      dom: 'lfBrtip',
      buttons: []
    };
  }

  setPartnerSetupInfo(data) {
    this.setup = data;
    if (data !== null && data !== undefined) {
      let setupValues = JSON.parse(data.setupValues);
      this.partnerChosen = data.partnerId;
      if (this.partnerChosen != undefined) this.onPartnerChange()

      let rc;
      if (data.reportingCalendar != undefined) rc = JSON.parse(data.reportingCalendar)
      this.calendar = {
        periodType: data.periodType,
        grantStartDate: data.startDate,
        grantEndDate: data.endDate,
        projectReportingStartDate: data.reportingStartDate,
        reportingCalender: rc
      };

      if (setupValues.disbursementPlan != undefined) {
        this.disbursementPlan = setupValues.disbursementPlan;
        this.disbursementPlan.forEach((data) => {
          this.updateDisbursementPlanValues(data.id, data.disbursement);
        });
      }

      if (setupValues.budget != undefined) {
        this.budget = setupValues.budget;
        this.budget.forEach((data) => {
          this.updateBudgetValues(data.id, data.approvedAmount);
        });
      }

      if (setupValues.currentStatus != undefined) this.currentStatus = setupValues.currentStatus;
      if (this.isValidJSONStr(setupValues.indicators)) this.indicators = JSON.parse(setupValues.indicators);
    } else {
      //this.calendar = SampleData.calendar;
      //this.indicatorsChosen = SampleData.indicators;
      //this.budget = SampleData.budget;
      //this.disbursementPlan = SampleData.disbursementPlan;
      //this.currentStatus = SampleData.currentStatus;
    }
    this.dtTrigger.next();
  }

  generateCalendar(event) {
    if (this.disbursementPlan.length>0 || this.indicators.length>0 || this.budget.length>0 ) {
      if (confirm('This action will clear the targets and disbursement entered')) {
        this.disbursementPlan = [];
        this.indicators = [];
        this.budget = [];
        this.calendarDates();
      }
    } else {
      this.calendarDates();
    }
  }

  calendarDates() {
    let startDate = this.calendar.projectReportingStartDate;
    let endDate = this.calendar.grantEndDate;

    if (this.calendar.periodType == "quarter") {
      //generate quarters
      this.calendar.reportingCalender = DateSplitter.genDatesInRange(startDate, endDate, false);
    } else if (this.calendar.periodType == "month") {
      //generate quarters
      this.calendar.reportingCalender = DateSplitter.genDatesInRange(startDate, endDate, true);
    } else if (this.calendar.periodType == "annual") {
      //generate two years
      let years = [];
      let months = DateSplitter.genDatesInRange(startDate, endDate, true);
      let numOfYears = Math.floor(months.length / 12);
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

    //set disbursement
      this.calendar.reportingCalender.forEach((period) => {
        this.disbursementPlan.push(
          {
            id: uuid(),
            datePeriod: period.datePeriod,
            startDate: period.startDate,
            endDate: period.endDate,
            disbursement: ''
          }
        );
      });
    this.savePlan();
  }

  onPartnerChange() {
    if (this.partnerChosen != undefined) {
      this.programPartnersService.getCurrentProgramPartner(this.partnerChosen).subscribe((results: any) => {
        if (results !== null && results !== undefined) {
          this.organisationalInfo = results;
          this.programChosen = results.programId;
          if (this.programChosen != undefined) {
            const params = new HttpParams().set('program', this.programChosen);
            this.projectMilestoneService.getMilestonesByProgram(params).subscribe((data) => {
              if (data !== null && data !== undefined) {
                this.milestones = data.milestones;
                //console.log('indicators', this.indicators);
              }
            });
          }
        }
      });
    } /*else {
      this.organisationalInfo = SampleData.organisationalInfo;
    }*/
  }

  createNewIndicator() {
    if (this.calendar.reportingCalender == undefined) {
      alert('No Calendar dates, Fill in reporting calendar');
      return;
    }

    if (this.milestones == undefined || this.milestones.length == 0) {
      alert('No Milestones found, Select Partner to proceed');
      return;
    }

    let id = uuid();
    this.indicators.push({id: id, name: '', overallTarget: '', disaggregation: []});
  }

  setDisaggregation(rowId) {
    if (this.indicators.some(x => x.id === rowId)) {
      this.indicators.forEach((item) => {
        this.calendar.reportingCalender.forEach((c) => {
          let exists = false;
          if (item.disaggregation.some(x => x.datePeriod === c.datePeriod)) exists = true;
          if (!exists) item.disaggregation.push(
            {
              datePeriod: c.datePeriod,
              target: ''
            }
          );
        });
        if (item.id === rowId) this.createNewBudgetItem(item.name);
      });
    }
  }

  createNewBudgetItem(value) {
    let id = uuid();
    this.budget.push({id: id, budgetLine: value, approvedAmount: ''});
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
      //set disaggregation values
      this.indicatorForDisaggregation = data;
    } else {
      button.firstChild.replaceWith(plus_icon);
    }
  }

  removeIndicator(indicator: Indicator) {
    this.indicators = this.indicators.filter(item=>item.id !=indicator.id );
    this.budget = this.budget.filter(item=>item.budgetLine !=indicator.name );
    this.budget.forEach((data) => {
      this.updateBudgetValues(data.id, data.approvedAmount);
    });
  }

  cellEditor(rowId, tdId, key: string, oldValue, type: string, selectList?: []) {
    new CellEdit().edit(rowId, tdId, oldValue, key, this.saveCellValue, type, '', selectList);
  }

  saveCellValue = (value: string, key: string, rowId): void => {
    if (value !== null && value !== undefined)
      switch (key) {
        case 'budget':
          this.updateBudgetValues(rowId, value);
          break;
        case 'disbursementPlan':
          this.updateDisbursementPlanValues(rowId, value);
          break;
        case 'disaggregation':
          let overallTarget: number = 0;
          let arr = rowId.split(' ');
          let datePeriod = arr[0];
          let indicatorId = arr[1];
          this.indicators.forEach((indicator) => {
            if(indicator.id === indicatorId) {
              if (indicator.disaggregation.some(x => x.datePeriod === datePeriod)) {
                indicator.disaggregation.forEach(function (item) {
                  if (item.datePeriod === datePeriod) item.target = value
                  if (item.target.length != 0) overallTarget += +item.target;
                });
                indicator.overallTarget = overallTarget.toString();
                this.indicatorForDisaggregation = indicator;
              }
            }
          });
          break;
        case 'indicators':
          if (this.indicators.some(x => x.id === rowId)) {
            this.indicators.forEach(function (item) {
              if (item.id === rowId) item.name = value
            });
          }
          this.setDisaggregation(rowId);
          break;
      }
    this.savePlan();
  }

  savePlan(done?: boolean) {
    this.error = false;
    this.success = false;

    let values: { [key: string]: string } = {
      indicators: JSON.stringify(this.indicators),
      budget: this.budget,
      disbursementPlan: this.disbursementPlan,
      currentStatus: this.currentStatus
    }

    let partnerSetupRecord: { [key: string]: string } = {
      userId: this.authService.getLoggedInUsername(),
      partnerId: this.partnerChosen,
      programId: this.programChosen,
      setupValues: JSON.stringify(values),
      startDate: this.calendar.grantStartDate,
      endDate: this.calendar.grantEndDate,
      reportingStartDate: this.calendar.projectReportingStartDate,
      reportingCalendar: JSON.stringify(this.calendar.reportingCalender),
      periodType: this.calendar.periodType,
    }

    if (this.setup) {
      this.partnerSetupService.updatePartnerSetup(partnerSetupRecord, this.setup.id).subscribe((data) => {
        this.setPartnerSetupInfo(data);
        this.error = false;
        this.success = true;
        this.successMessage = "Updated Partner Setup";
      }, error => {
        this.error = true;
        this.errorMessage = "Failed to update Partner Setup";
        this.success = false;
        console.log(error);
      });
    } else {
      this.partnerSetupService.createPartnerSetup(partnerSetupRecord).subscribe((data) => {
        this.setPartnerSetupInfo(data);
        this.error = false;
        this.success = true;
        this.successMessage = "Saved Partner Setup";
      }, error => {
        this.error = true;
        this.errorMessage = "Failed to save Partner Setup";
        this.success = false;
        console.log(error);
      });
    }

    setTimeout(() => {
      if (done == true && this.success) this.onBackPressed();
      this.success = false;
      this.error = false;
    }, 3000);
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

  private updateBudgetValues(id, newValue) {
    let total: number = 0;
    if (this.budget.some(x => x.id === id)) {
      this.budget.forEach(function (item) {
        if (item.id === id) item.approvedAmount = newValue;
        total += +item.approvedAmount;
      });
    }
    this.totalApprovedAmount = total.toString();
  }

  private updateDisbursementPlanValues(id, newValue) {
    let totalD: number = 0;
    if (this.disbursementPlan.some(x => x.id === id)) {
      this.disbursementPlan.forEach(function (item) {
        if (item.id === id) item.disbursement = newValue
        totalD += +item.disbursement;
      });
    }
    this.totalDisbursement = totalD.toString()
  }
}
