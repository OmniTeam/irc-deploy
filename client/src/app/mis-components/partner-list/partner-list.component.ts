import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {PartnerSetupService} from "../../services/partner-setup.service";

@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.css']
})
export class PartnerListComponent implements OnInit {

  rows: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private router: Router, private partnerSetupService: PartnerSetupService) { }

  ngOnInit(): void {
    this.partnerSetupService.getPartnerSetup().subscribe(data => {
      console.log(data);
      this.rows = data;
      this.dtTrigger.next();
    }, error => console.log(error));

    this.dtOptions = {
      pagingType: "numbers",
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      processing: true,
      responsive: true,
      dom: 'lfBrtip',
      buttons: [
        {
          text: '<i class="fas fa-file-csv" style="color: green;"></i>&nbsp;&nbsp;Export to CSV',
          extend: 'csvHtml5',
          title: 'TaskList'
        },
        {
          text: '<i class="far fa-file-excel" style="color: green;"></i>&nbsp;&nbsp;Export to Excel',
          extend: 'excelHtml5',
          title: 'TaskList'
        }
      ]
    };
  }

}
