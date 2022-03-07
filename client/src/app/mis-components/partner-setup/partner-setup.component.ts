import {Component, OnInit} from '@angular/core';
import {SampleData} from "../../helpers/sample-data";
import {Subject} from "rxjs";
import {PartnerSetupService} from "../../services/partner-setup.service";
import {ProgramPartnersService} from "../../services/program-partners.service";
import {CellEdit, OnUpdateCell} from '../../helpers/cell-edit';
import {Location} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {DateSplitter} from '../../helpers/date-splitter';
import {HttpParams} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectMilestoneService} from "../../services/project-milestone.service";

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
  indicatorChosen: {
    id: string;
    name: string;
    overallTarget: string;
    disaggregation: {
      datePeriod: string,
      target: string
    }[]
  };
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
    this.indicatorChosen = SampleData.indicators[0];
    this.indicators = SampleData.indicators;
    this.calendar = SampleData.calendar;

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

  cellEditor(row, td_id, key: string, oldValue) {
    new CellEdit().edit(row.id, td_id, '', oldValue, key, this.saveCellValue);
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

    this.calendar.reportingCalender.forEach((c) => {
      this.indicatorChosen.disaggregation.push(
        {
          datePeriod: c.datePeriod,
          target: ''
        }
      );
    });

    const table = document.getElementById('indicators') as HTMLTableElement;
    const tr = table.createTBody().insertRow(0)
    tr.insertAdjacentHTML('beforeend', "<td class=\'text-center\' style='display: none;'>" + row.id + "</td>\n" +
    "                      <td class=\'text-center\'>\n" +
    "                        <div class='form-group text-center' style='margin: 0 0 30px 30px; width: 60%;'>\n" +
    "                          <select class='form-control form-control-sm' aria-label='Default select example'>\n" +
    "                              <option selected>Select Milestone</option>\n" + this.getOptionsForSelect(this.indicators) +
    "                         </select>" +
    "                        </div>\n" +
    "                      </td>\n" +
    "                      <td class=\'text-center\'>" + row.overallTarget + "</td>\n" +
    "                      <td class=\'text-center\'>\n" +
    "                   <button class='btn btn-link' id='" + row.id + "' onclick='this.toggleDisaggregation($event, " + JSON.stringify(row) + ")'>" +
    "                    <i style='font-size:20px;' class='text fas fa-plus'><i/></button></div>" +
    "                      </td>");
  }

  toggleDisaggregation(event, row) {
    console.log('calendar', this.calendar.reportingCalender);
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
      //button.firstChild.replaceWith(plus_icon);
      details.style.display = 'none';
      details.parentNode.removeChild(details);
    }
  }

  getRowsForDetails(data): string {
    let htmlString = "";
    data.forEach(function (row) {
      htmlString += "<tr>\n" +
        "<td class=\'text-center\'>" + row.datePeriod + "</td>\n" +
        "<td class=\'text-center\'><div>" + row.target +
        "<button class='btn btn-link' onclick='this.cellEditor(" + JSON.stringify(row) + ", " + row.id + ", \"disbursementPlan\", " + row.disbursement + ")'>" +
        "<i class='fas fa-pencil-alt'></i></button></div> </td>\n" +
        "</tr>\n";
    });
    return htmlString;
  }

  getOptionsForSelect(data): string {
    console.log('data', data);
    let htmlString = "";
    data.forEach(function (row) {
      htmlString += '<option value="' + row.id + '">\n' + row.name + '</option>\n';
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
