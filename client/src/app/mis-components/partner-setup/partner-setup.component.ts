import {Component, OnInit} from '@angular/core';
import {SampleData} from "../../helpers/sample-data";
import {Subject} from "rxjs";
import {PartnerSetupService} from "../../services/partner-setup.service";
import {CellEdit, OnUpdateCell} from '../../helpers/cell-edit';
import {Location} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {DateSplitter} from '../../helpers/date-splitter';

@Component({
  selector: 'app-partner-setup',
  templateUrl: './partner-setup.component.html',
  styleUrls: ['./partner-setup.component.css']
})
export class PartnerSetupComponent implements OnInit, OnUpdateCell {

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rows: [] = [];
  calendar: {
    id: string;
    periodType:string;
    grantStartDate:string;
    grantEndDate:string;
    projectReportingStartDate: string;
    reportingCalender: any
  };
  indicators: any;
  budget: any;
  disbursementPlan: any;
  showDisaggregation: boolean;
  disaggregation: any;
  organisationalInfo: any;
  periodItems = [
    {name: 'Monthly', value: 'month'},
    {name: 'Quarterly', value: 'quarter'},
    {name: 'Annually', value: 'annual'}
  ];
  currentStatus: {
    startReportingCycle: string;
    totalAmountAccountedFor: string;
    totalAmountDisbursed: string;
    dateOfLastDisbursement: string
  };
  businessChampion = [
    {
      name: 'BC One',
      value: 'bc_one'
    },
    {
      name: 'BC Two',
      value: 'bc_two'
    },
    {
      name: 'BC Three',
      value: 'bc_three'
    }
  ];

  constructor(private location: Location, private partnerSetupService: PartnerSetupService, public authService: AuthService) { }

  ngOnInit(): void {
    this.organisationalInfo = SampleData.organisationalInfo;
    this.calendar = SampleData.calendar;
    this.indicators = SampleData.indicators;
    this.budget = SampleData.budget;
    this.disbursementPlan = SampleData.disbursementPlan;
    this.currentStatus = SampleData.currentStatus;

    this.partnerSetupService.getInfo().subscribe(data => {
      console.log(data);
      this.rows = data;
      this.dtTrigger.next();
    }, error => console.log(error));

    this.dtOptions = {
      pagingType: "numbers",
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
      processing: true,
      responsive: true,
      dom: 'lfBrtip',
      buttons: []
    };
  }

  generateCalendar(event) {
    let startDate = this.calendar.grantStartDate;
    let endDate = this.calendar.grantEndDate;

    if(this.calendar.periodType=="quarter") {
      //generate quarters
      this.calendar.reportingCalender = DateSplitter.genDatesInRange(startDate, endDate, false);
    } else if(this.calendar.periodType=="month") {
      //generate quarters
      this.calendar.reportingCalender = DateSplitter.genDatesInRange(startDate, endDate, true);
    } else if(this.calendar.periodType=="annual") {
      //generate two years
      let years = [];
      let months = DateSplitter.genDatesInRange(startDate, endDate, true);
      console.log('months', months);
      let numOfYears = Math.floor(months.length/12);
      let countStart = 0;
      let countEnd = 0;
      for(let number=1; number<=numOfYears; number++) {
        countStart = countEnd + (number-1);
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

  saveCellValue(value: string, key: string, rowId): any {
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

  cellEditor(row, td_id, key: string, oldValue) {
    new CellEdit().edit(row.id, td_id, '', oldValue, key, this.saveCellValue);
  }

  toggleDisaggregation(event, row) {
    this.showDisaggregation = !this.showDisaggregation;
    const button = (document.getElementById(row.id) as HTMLButtonElement);
    let details = (document.getElementById("detailsDisaggregation") as HTMLTableRowElement);
    let target = event.target;

    const minus_icon = document.createElement('i');
    minus_icon.classList.add('text', 'fas', 'fa-minus');
    minus_icon.style.fontSize = '20px';
    minus_icon.style.color =  'red';

    const plus_icon = document.createElement('i');
    plus_icon.classList.add('text', 'fas', 'fa-plus');
    plus_icon.style.fontSize = '20px';

    if(this.showDisaggregation) {
      const tr = <HTMLTableRowElement> target.closest('tr');
      button.firstChild.replaceWith(minus_icon);
      tr.insertAdjacentHTML('afterend', '' +
        '  <tr id="detailsDisaggregation">\n' +
        '                      <td colspan="5">\n' +
        '                          <table style="padding-left:50px;"\n' +
        '                                 class="table table-striped table-bordered" id="disaggregation">\n' +
        '                            <thead>\n' +
        '                            <tr>\n' +
        '                              <th class=\'text-center\'>Period</th>\n' +
        '                              <th class=\'text-center\'>Target</th>\n' +
        '                            </tr>\n' +
        '                            </thead>\n' +
        '                            <tbody>\n' + this.getRowsForDetails(row.disaggregation) +
        '                            </tbody>\n' +
        '                          </table>\n' +
        '                      </td>\n' +
        '                    </tr>' +
        '');
      details.style.display = 'block';
    } else {
      button.firstChild.replaceWith(plus_icon);
      details.style.display = 'none';
      details.parentNode.removeChild(details);
    }
  }

  getRowsForDetails(data) : string {
    let htmlString = "";
    data.forEach(function (row) {
      htmlString += '<tr>\n' +
        '<td class=\'text-center\'>' + row.datePeriod + '</td>\n' +
        '<td class=\'text-center\'>' + row.target + '</td>\n' +
        '</tr>\n';
    });
    return htmlString;
  }

  onSavePlan() {
    console.log('calendar', this.calendar);
    console.log('indicators', this.indicators);
    console.log('budget', this.budget);
    console.log('disbursementPlan', this.disbursementPlan);
    console.log('currentStatus', this.currentStatus);
    console.log('user', this.authService.getLoggedInUsername());
  }

  onBackPressed() {
    this.location.back();
  }
}
