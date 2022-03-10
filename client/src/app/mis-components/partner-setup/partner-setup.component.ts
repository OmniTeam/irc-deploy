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
  disbursementPlan: any = [];
  currentStatus: any = {};
  indicatorRecord: Indicator;
  indicators: Indicator[];

  setup: any;
  disaggregation: any = [];
  organisationalInfo: any = [];
  listOfPartners: any = [];
  milestones: any = [];
  partnerChosen: string;
  milestoneChosen: any;
  programChosen: string;
  partnerSetupId: string;

  editing: boolean;
  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;
  showDisaggregation: boolean;

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
      console.log('setupValues', setupValues);
      this.partnerChosen = data.partnerId
      if (this.partnerChosen != undefined) this.onPartnerChange()
      if (setupValues.calendar != undefined) this.calendar = setupValues.calendar;
      if (setupValues.disbursementPlan != undefined) this.disbursementPlan = setupValues.disbursementPlan;
      if (setupValues.currentStatus != undefined) this.currentStatus = setupValues.currentStatus;
      if (setupValues.budget != undefined) {
        this.budget = setupValues.budget;
        this.milestoneChosen = setupValues.budget.budgetLine;
      }
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
    let startDate = this.calendar.grantStartDate;
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
    if (!this.setup) {
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
    }
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

  createNewIndicator(row) {
    this.indicatorRecord = {id: '', name: '', overallTarget: '', disaggregation: []};
    if (this.calendar.reportingCalender == undefined) {
      alert('No Calendar dates, Fill in reporting calendar');
      return;
    }

    if (this.milestones == undefined || this.milestones.length == 0) {
      alert('No Milestones found, Select Partner to proceed');
      return;
    }

    let btn_id = uuid();

    const table = document.getElementById('indicators') as HTMLTableElement;

    const button = document.createElement('button');

    const select = document.createElement('select');
    select.classList.add('form-control', 'form-control-sm');
    select.addEventListener("change", (e: Event) => {
      row.id = select.value;
      row.name = select.name;
      this.calendar.reportingCalender.forEach((c) => {
        row.disaggregation.push(
          {
            datePeriod: c.datePeriod,
            target: ''
          }
        );
      });
    });
    select.insertAdjacentHTML('beforeend', "<option selected>Select Milestone</option>\n" + this.getOptionsForSelect(this.milestones));

    const div = document.createElement('div');
    div.classList.add('form-group', 'text-center');
    div.style.margin = '0 0 30px 30px';
    div.style.width = '60%';
    div.appendChild(select);

    const td1 = document.createElement('td');
    td1.classList.add('text-center');
    td1.appendChild(div);

    const td2 = document.createElement('td');
    td2.classList.add('text-center');
    td2.insertAdjacentHTML('beforeend', row.overallTarget);

    const icon_plus = document.createElement('i');
    icon_plus.classList.add('text', 'fas', 'fa-plus');
    icon_plus.style.fontSize = '20px';

    button.id = btn_id;
    button.classList.add('btn', 'btn-link');
    button.addEventListener("click", (e: Event) => this.toggleDisaggregation(e, btn_id, row));
    button.appendChild(icon_plus);

    const td3 = document.createElement('td');
    td3.classList.add('text-center');
    td3.appendChild(button);

    const tr = table.createTBody().insertRow(0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
  }

  createNewBudgetItem() {
    if (this.milestones == undefined || this.milestones.length == 0) {
      alert('No Milestones found, Select Partner to proceed');
      return;
    }

    let id = uuid();
    this.budget.push({id: id, budgetLine: '', approvedAmount: ''});
  }

  setBudgetLine() {
    if (this.milestoneChosen != undefined) {
      if (this.budget.some(x => x.id === this.milestoneChosen.id)) {
        this.budget.forEach((item) => {
          if (item.id === this.milestoneChosen) item.budgetLine = this.milestoneChosen.value;
        });
      }
    }
  }

  toggleDisaggregation(event, btn_id, row) {
    this.showDisaggregation = !this.showDisaggregation;
    const button = (document.getElementById(btn_id) as HTMLButtonElement);
    let details = (document.getElementById("detailsDisaggregation") as HTMLTableRowElement);
    let target = event.target;

    const minus_icon = document.createElement('i');
    minus_icon.classList.add('text', 'fas', 'fa-minus');
    minus_icon.style.fontSize = '20px';
    minus_icon.style.color = 'red';

    const plus_icon = document.createElement('i');
    plus_icon.classList.add('text', 'fas', 'fa-plus');
    plus_icon.style.fontSize = '20px';

    if (this.showDisaggregation) {
      const tr = <HTMLTableRowElement>target.closest('tr');
      button.firstChild.replaceWith(minus_icon);

      const td = document.createElement('td');
      td.colSpan = 5;

      const tr2 = document.createElement('tr');
      tr2.id = 'detailsDisaggregation';

      const table = document.createElement('table');
      table.style.paddingLeft = '50px';
      table.classList.add('table', 'table-striped', 'table-bordered');
      table.id = 'disaggregation';

      const thead = document.createElement('thead');
      const tr3 = document.createElement('tr');
      const th1 = document.createElement('th');
      th1.classList.add('text-center');
      th1.insertAdjacentHTML('beforeend', 'Period');
      const th2 = document.createElement('th');
      th2.classList.add('text-center');
      th2.insertAdjacentHTML('beforeend', 'Target');
      tr3.appendChild(th1);
      tr3.appendChild(th2);
      thead.appendChild(tr3);

      table.appendChild(thead);
      table.appendChild(this.getRowsForDetails(row));

      td.appendChild(table);

      tr2.appendChild(td);

      tr.insertAdjacentElement('afterend', tr2);

      if (details != null) details.style.display = 'block';
    } else {
      button.firstChild.replaceWith(plus_icon);
      details.style.display = 'none';
      details.parentNode.removeChild(details);
    }
  }

  getRowsForDetails(row): HTMLTableSectionElement {
    const tbody = document.createElement('tbody');
    row.disaggregation.forEach((row) => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      td1.classList.add('text-center');
      td1.insertAdjacentHTML('beforeend', row.datePeriod);

      const editableDiv = new CellEdit().createEditableCell(
        this.saveCellValue,
        row.datePeriod,
        'disaggregation',
        row.target,
        'number'
      );

      const td2 = document.createElement('td');
      td2.classList.add('text-center');
      td2.id = row.datePeriod;
      td2.insertAdjacentHTML('afterbegin', row.target);
      td2.appendChild(editableDiv);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
    });
    return tbody;
  }

  getOptionsForSelect(data): string {
    let htmlString = "";
    data.forEach(function (row) {
      htmlString += '<option value="' + row.id + '" name="' + row.name + '">' + row.name + '</option>';
    });
    return htmlString;
  }

  cellEditor(rowId, key: string, oldValue, type?: string) {
    new CellEdit().edit(rowId, rowId, oldValue, key, this.saveCellValue, type);
  }

  saveCellValue = (value: string, key: string, rowId): void => {
    if (value !== null && value !== undefined)
      switch (key) {
        case 'budget':
          if (this.budget.some(x => x.id === rowId)) {
            this.budget.forEach(function (item) {
              if (item.id === rowId) item.approvedAmount = value
            });
          }
          break;
        case 'disbursementPlan':
          if (this.disbursementPlan.some(x => x.id === rowId)) {
            this.disbursementPlan.forEach(function (item) {
              if (item.id === rowId) item.disbursement = value
            });
          }
          break;
        case 'disaggregation':
          let overallTarget: number = 0;
          if (this.indicatorRecord.disaggregation.some(x => x.datePeriod === rowId)) {
            this.indicatorRecord.disaggregation.forEach(function (item) {
              if (item.datePeriod === rowId) item.target = value
              if (item.target.length != 0) overallTarget += +item.target;
            });
            this.indicatorRecord.overallTarget = overallTarget.toString();
          }
          if (this.indicators.some(x => x.id === this.indicatorRecord.id)) {
            this.indicators.forEach((indicator) => {
              if (indicator.id === this.indicatorRecord.id) indicator = this.indicatorRecord
            });
          } else this.indicators.push(this.indicatorRecord);
          console.log('save indicators', this.indicators);
          break;
      }
    this.savePlan();
  }

  savePlan(done?: boolean) {
    this.error = false;
    this.success = false;

    console.log('this.indicatorsChosen', this.indicators);
    console.log('this.budget', this.budget);

    let values: { [key: string]: string } = {
      calendar: this.calendar,
      indicators: JSON.stringify(this.indicators),
      budget: this.budget,
      disbursementPlan: this.disbursementPlan,
      currentStatus: this.currentStatus
    }

    let partnerSetupRecord: { [key: string]: string } = {
      partnerId: this.partnerChosen,
      userId: this.authService.getLoggedInUsername(),
      setupValues: JSON.stringify(values),
    }

    if (this.setup) {
      this.partnerSetupService.updatePartnerSetup(partnerSetupRecord, this.setup.id).subscribe((data) => {
        console.log('data', data);
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
        console.log('data', data);
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
      this.success = false;
      this.error = false;
      if (done != undefined && done == true) this.onBackPressed();
    }, 6000);
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
}
