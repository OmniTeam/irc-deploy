import { Component, OnInit } from '@angular/core';
import {SampleData} from "../../helpers/sample-data";
import {Subject} from "rxjs";
import {PartnerSetupService} from "../../services/partner-setup.service";
import {CellEdit, OnUpdateCell} from '../../helpers/cell_edit';
import {Location} from "@angular/common";
import {AuthService} from "../../services/auth.service";

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
  periodChosen: string;
  periodItems = [
    {name: 'Monthly', value: 'month'},
    {name: 'Quarterly', value: 'quarter'},
    {name: 'Biannually', value: 'biannual'}
  ];
  currentStatus: {
    startReportingCycle: string;
    totalAmountAccountedFor: string;
    totalAmountDisbursed: string;
    dateOfLastDisbursement: string
  };

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
    console.log(event);
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
