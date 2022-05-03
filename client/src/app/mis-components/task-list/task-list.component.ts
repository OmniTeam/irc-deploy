import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ReportFormService} from "../../services/report-form.service";

@Component({
  selector: 'app-tasklist',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  rows: any = [];
  temp: any = [];
  entries: number = 10;

  constructor(
    private router: Router,
    private reportFormService: ReportFormService
  ) {
  }

  ngOnInit(): void {
    this.reloadTable();
  }

  reloadTable() {
    this.reportFormService.getAllReports().subscribe(data => {
      this.rows = data;
      this.temp = [...data];
    }, error => console.log(error));
  }

  entriesChange($event) {
    this.entries = $event.target.value;
    this.reloadTable();
  }

  onChangeSearch(event) {
    let val = event.target.value.toLowerCase();
    // update the rows
    this.rows = this.temp.filter(function (d) {
      for (const key in d) {
        if (d[key]?.toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  onSearch(event) {
    this.reloadTable();
  }
}
