import { Component, OnInit } from '@angular/core';
import {DummyData} from "../../utilities/dummy-data";
import {Subject} from "rxjs";
import {PartnerSetupService} from "../../services/partner-setup.service";
import {CellEdit, OnUpdateCell} from '../../utilities/cell_edit';

@Component({
  selector: 'app-partner-setup',
  templateUrl: './partner-setup.component.html',
  styleUrls: ['./partner-setup.component.css']
})
export class PartnerSetupComponent implements OnInit {

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rows: [] = [];
  calendar: any;
  indicators: any;
  budget: any;
  disbursementPlan: any;

  organisationalInfo: any;
  periodChosen: string;
  totalAmountDisbursed: string;
  totalAmountAccountedFor: string;
  dateOfLastDisbursement: string;
  startReportingCycle: string;
  periodItems = [
    {name: 'Monthly', value: 'monthly'},
    {name: 'Quarterly', value: 'quarterly'},
    {name: 'Biannually', value: 'biannually'}
  ];

  constructor(private partnerSetupService: PartnerSetupService) { }

  ngOnInit(): void {
    this.organisationalInfo = DummyData.organisationalInfo;
    this.calendar = DummyData.calendar;
    this.indicators = DummyData.indicators;
    this.budget = DummyData.budget;
    this.disbursementPlan = DummyData.disbursementPlan;

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

}
