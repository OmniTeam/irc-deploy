import {Component, OnInit} from '@angular/core';
import {SampleData} from "../../helpers/sample-data";
import {Subject} from "rxjs";
import {PartnerSetupService} from "../../services/partner-setup.service";
import {CellEdit, OnUpdateCell} from '../../helpers/cell-edit';
import {Location} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {DateSplitter} from '../../helpers/date-splitter';
import {HttpParams} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

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
  periodItems = [
    {name: 'Monthly', value: 'month'},
    {name: 'Quarterly', value: 'quarter'},
    {name: 'Annually', value: 'annual'}
  ];
  currentStatus:any = [];
  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;
  private partnerSetupId: string;

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private partnerSetupService: PartnerSetupService, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.organisationalInfo = SampleData.organisationalInfo;
    this.listOfPartners = SampleData.partners;

    this.route.params
      .subscribe(p => {
        this.partnerSetupId = p['id'];
        const params = new HttpParams().set('id', this.partnerSetupId);
        this.partnerSetupService.getPartnerSetupRecord(params).subscribe(data => {
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
        }, error => console.log(error));
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
    minus_icon.style.color = 'red';

    const plus_icon = document.createElement('i');
    plus_icon.classList.add('text', 'fas', 'fa-plus');
    plus_icon.style.fontSize = '20px';

    if (this.showDisaggregation) {
      const tr = <HTMLTableRowElement>target.closest('tr');
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

  getRowsForDetails(data): string {
    let htmlString = "";
    data.forEach(function (row) {
      htmlString += '<tr>\n' +
        '<td class=\'text-center\'>' + row.datePeriod + '</td>\n' +
        '<td class=\'text-center\'><div>' + row.target +
        '<button class="btn btn-link" onclick="cellEditor(' + row + ', ' + row.id + ', \'disbursementPlan\', ' + row.disbursement + ')">' +
        '<i class="fas fa-pencil-alt"></i></button></div> </td>\n' +
        '</tr>\n';
    });
    return htmlString;
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
