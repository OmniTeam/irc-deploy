import { Component, OnInit } from '@angular/core';
import {EntityViews} from "../../models/entity";
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {EntityService} from "../../services/entity.service";

@Component({
  selector: 'app-entity-views',
  templateUrl: './entity-views.component.html',
  styleUrls: ['./entity-views.component.css']
})
export class EntityViewsComponent implements OnInit {

  rows: EntityViews[] = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private entityService: EntityService) { }

  ngOnInit(): void {
    this.entityService.getEntityViews().subscribe((data) => {
      this.rows = data;
      this.dtTrigger.next();
    }, error => console.log(error));

    this.dtOptions = {
      pagingType: "numbers",
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
      processing: true,
      responsive: true,
      dom: 'lfBrtip',
      buttons: [
        {
          text: '<i class="fas fa-file-csv" style="color: green; font-size: 20px;"></i>&nbsp;&nbsp;Export to CSV',
          extend: 'csvHtml5',
          title: 'Entity View'
        },
        {
          text: '<i class="far fa-file-excel" style="color: green; font-size: 20px;"></i>&nbsp;&nbsp;Export to Excel',
          extend: 'excelHtml5',
          title: 'Entity View'
        }
      ]
    };
  }

}
