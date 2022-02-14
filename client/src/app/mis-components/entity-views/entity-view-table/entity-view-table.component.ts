import {Component, OnInit} from '@angular/core';
import {EntityViews} from "../../../models/entity";
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {EntityService} from "../../../services/entity.service";
import {HttpParams} from "@angular/common/http";
import DevExpress from "devextreme";
import data = DevExpress.data;

@Component({
  selector: 'app-entity-view-table',
  templateUrl: './entity-view-table.component.html',
  styleUrls: ['./entity-view-table.component.css']
})
export class EntityViewTableComponent implements OnInit {

  rows = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  entityViewId: any;
  columns = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private entityService: EntityService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entityViewId = params.id;
    });
    const params = new HttpParams()
      .set('id', this.entityViewId);

    this.entityService.getEntityViewData(params).subscribe((data) => {
      this.columns = data['headers'];
      this.rows = data['dataList'];
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
