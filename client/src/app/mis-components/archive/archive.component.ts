import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TaskListService} from "../../services/task-list.service";

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {

  rows: any = [];
  temp: any = [];
  entries: number = 10;

  constructor(
    private router: Router,
    private taskListService:TaskListService
  ) {
  }

  ngOnInit(): void {
    this.reloadTable();
  }

  reloadTable() {
    this.taskListService.getTaskList().subscribe(data => {
      console.log(data)
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
