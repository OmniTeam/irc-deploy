import {Component, OnInit} from '@angular/core';
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
  rows: [] = [];
  calendar: any = [];
  indicators: any = [];
  budget: any = [];
  disbursementPlan: any = [];
  showDisaggregation: boolean;
  disaggregation: any = [];
  organisationalInfo: any = [];
  listOfPartners: any = [];
  partnerChosen: string;
  programChosen: string;
  periodItems = [
    {name: 'Monthly', value: 'month'},
    {name: 'Quarterly', value: 'quarter'},
    {name: 'Annually', value: 'annual'}
  ];
  indicatorChosen: Indicator;
  currentStatus: any = [];
  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;
  private partnerSetupId: string;

  constructor(private router: Router, private route: ActivatedRoute,
              private location: Location,
              private partnerSetupService: PartnerSetupService,
              public authService: AuthService,
              private programPartnersService: ProgramPartnersService,
              private projectMilestoneService: ProjectMilestoneService) {
  }

  ngOnInit(): void {
    this.indicatorChosen = {id: '', name: '', overallTarget: '', disaggregation: []};
    this.route.params
      .subscribe(p => {
        this.partnerSetupId = p['id'];
        const params = new HttpParams().set('id', this.partnerSetupId);
        this.partnerSetupService.getPartnerSetupRecord(params).subscribe(data => {
          this.setPartnerSetupInfo(data);
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
    if (data.setup !== null && data.setup !== undefined) {
      this.rows = data.setup;
      let setupValues = JSON.parse(data.setup.setupValues);
      console.log('setupValues', setupValues);
      this.calendar = JSON.parse(setupValues.calendar);
      this.indicators = JSON.parse(setupValues.indicators);
      this.budget = JSON.parse(setupValues.budget);
      this.disbursementPlan = JSON.parse(setupValues.disbursementPlan);
      this.currentStatus = JSON.parse(setupValues.currentStatus);
      this.partnerChosen = data.setup.partnerId
    } /*else {
          this.calendar = SampleData.calendar;
          this.indicators = SampleData.indicators;
          this.budget = SampleData.budget;
          this.disbursementPlan = SampleData.disbursementPlan;
          this.currentStatus = SampleData.currentStatus;
        }*/
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
  }

  onPartnerChange(event) {
    if (this.partnerChosen != undefined) {
      this.programPartnersService.getCurrentProgramPartner(this.partnerChosen).subscribe((results: any) => {
        if (results !== null && results !== undefined) {
          this.organisationalInfo = results;
          this.programChosen = results.programId;
          if (this.programChosen != undefined) {
            const params = new HttpParams().set('program', this.programChosen);
            this.projectMilestoneService.getMilestonesByProgram(params).subscribe((data) => {
              if (data !== null && data !== undefined) {
                this.indicators = data.milestones;
                console.log('indicators', this.indicators);
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
    if (this.calendar.reportingCalender == undefined) {
      console.log('Error', 'No Calendar dates');
      return;
    }

    if (this.indicators == undefined || this.indicators.length == 0) {
      console.log('Error', 'No Milestones/Indicators');
      return;
    }

    let btn_id = uuid();

    const table = document.getElementById('indicators') as HTMLTableElement;

    const button = document.createElement('button');

    const select = document.createElement('select');
    select.classList.add('form-control', 'form-control-sm');
    select.addEventListener("change", (e: Event) => {
      this.indicatorChosen.id = select.value;
      this.indicatorChosen.name = select.name;
      this.calendar.reportingCalender.forEach((c) => {
        this.indicatorChosen.disaggregation.push(
          {
            datePeriod: c.datePeriod,
            target: ''
          }
        );
      });
    });
    select.insertAdjacentHTML('beforeend', "<option selected>Select Milestone</option>\n" + this.getOptionsForSelect(this.indicators));

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
    button.addEventListener("click", (e: Event) => this.toggleDisaggregation(e, row, btn_id));
    button.appendChild(icon_plus);

    const td3 = document.createElement('td');
    td3.classList.add('text-center');
    td3.appendChild(button);

    const tr = table.createTBody().insertRow(0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
  }

  toggleDisaggregation(event, row, btn_id) {
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
      table.appendChild(this.getRowsForDetails(row.disaggregation));

      td.appendChild(table);

      tr2.appendChild(td);

      tr.insertAdjacentElement('afterend', tr2);

      details.style.display = 'block';
    } else {
      button.firstChild.replaceWith(plus_icon);
      details.style.display = 'none';
      details.parentNode.removeChild(details);
    }
  }

  getRowsForDetails(data): HTMLTableSectionElement {
    const tbody = document.createElement('tbody');
    data.forEach((row) => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      td1.classList.add('text-center');
      td1.insertAdjacentHTML('beforeend', row.datePeriod);

      const icon_pencil = document.createElement('i');
      icon_pencil.classList.add('fas', 'fa-pencil-alt');

      const button = document.createElement('button');
      button.classList.add('btn', 'btn-link');
      button.addEventListener('click', (e: Event) => this.cellEditor(row, row.datePeriod, 'disaggregation', row.target, 'number'));
      button.appendChild(icon_pencil);

      const div = document.createElement('div');
      div.insertAdjacentHTML('afterbegin', row.target);
      div.appendChild(button);

      const td2 = document.createElement('td');
      td2.classList.add('text-center');
      td2.id = row.datePeriod;
      td2.appendChild(div);

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

  cellEditor(row, td_id, key: string, oldValue, type?: string) {
    new CellEdit().edit(row.id, td_id, oldValue, key, this.saveCellValue, type);
    if (key == 'disaggregation') {
      let newValue = (document.getElementById("input-" + td_id) as HTMLTextAreaElement).value
      if (this.indicatorChosen.disaggregation.some(x => x.datePeriod === row.id)) {
        this.indicatorChosen.disaggregation.forEach(function (item) {
          if (item.datePeriod === row.id) item.target = newValue
        });
      }
    }
  }

  saveCellValue(value: string, key: string, rowId): any {
    console.log('indicatorChosen', this.indicatorChosen);
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
    }
  }

  onSavePlan() {
    this.error = false;
    this.success = false;

    let reportValues: { [key: string]: string } = {
      calendar: JSON.stringify(this.calendar),
      indicators: JSON.stringify(this.indicators),
      budget: JSON.stringify(this.budget),
      disbursementPlan: JSON.stringify(this.disbursementPlan),
      currentStatus: JSON.stringify(this.currentStatus)
    }

    let partnerSetupRecord: { [key: string]: string } = {
      partnerId: this.partnerChosen,
      userId: this.authService.getLoggedInUsername(),
      setupValues: JSON.stringify(reportValues),
    }

    console.log('partnerSetupRecord', partnerSetupRecord);

    this.partnerSetupService.createPartnerSetup(partnerSetupRecord).subscribe((data) => {
      this.error = false;
      this.success = true;
      this.successMessage = "Saved Report";
    }, error => {
      this.error = true;
      this.errorMessage = "Failed to save Report";
      this.success = false;
      console.log(error);
    });

    setTimeout(() => {
      this.success = false;
      this.error = false;
      this.onBackPressed();
    }, 6000);
  }

  onBackPressed() {
    this.location.back();
  }
}
