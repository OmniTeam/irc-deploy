import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataViewService} from "../../../services/data-view.service";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-data-view-table',
  templateUrl: './data-view-table.component.html',
  styleUrls: ['./data-view-table.component.css']
})
export class DataViewTableComponent implements OnInit {

  entityName = "";
  entries = 10;
  selected = [];
  activeRow: any;
  rows: Object[];
  temp: Object[];
  columns: any;
  dataViewId = "";
  dataViewName = "";
  checkIfTableHasData = true;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataViewService : DataViewService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.dataViewId = params.id;
    });
    const params = new HttpParams()
      .set('id', this.dataViewId);
    this.dataViewService.getDataViewData(params).subscribe((data) => {
      if (data['headerList'].length > 0) {
        this.dataViewName = data['name']
        this.temp= [...data['dataList']];
        this.rows = data['dataList'];
        this.columns = this.formattedColumns(data['headerList']);
        this.checkIfTableHasData = true;
      }
      else {
        this.checkIfTableHasData = false;
      }

    });
  }

  formattedColumns(array) {
    const columns = [];
    for (const column of array) {
      const columnProperties = {};
      columnProperties['prop'] = column;
      columnProperties['name'] = column.replaceAll('_', ' ').toUpperCase().trim();
      columns.push(columnProperties);
    }
    return columns;
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable(event) {
    let val = event.target.value.toLowerCase();
    this.rows = this.temp.filter(function (d) {
      for (const key in d) {
        if (d[key]?.toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

}
