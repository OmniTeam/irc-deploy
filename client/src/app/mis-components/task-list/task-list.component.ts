import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TaskListService} from "../../services/task-list.service";
import {TaskList} from "../../models/tasklist";
import {Subject} from "rxjs";

@Component({
  selector: 'app-tasklist',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  rows: TaskList[] = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor( private router: Router, private taskListService: TaskListService) {
  }

  ngOnInit(): void {
    this.taskListService.getTaskList().subscribe(data => {
      console.log('tasklist',data);
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
