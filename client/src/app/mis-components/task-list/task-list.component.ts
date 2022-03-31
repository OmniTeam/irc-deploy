import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TaskListService} from "../../services/task-list.service";
import {ProgramPartnersService} from "../../services/program-partners.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-tasklist',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  rows: any = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private router: Router, private taskListService: TaskListService, private programPartnersService: ProgramPartnersService) {
  }

  ngOnInit(): void {
    this.taskListService.getTaskList().subscribe(tasks => {
      let list = []

      if (tasks != null) {
        tasks.forEach((task) => {
          this.programPartnersService.getCurrentProgramPartner(task.partnerId).subscribe((results: any) => {
            if (results !== null && results !== undefined) {
              list.push({
                id: task.id,
                taskName: task.taskName,
                startDate: task.startDate,
                endDate: task.endDate,
                partner: results.name,
                program: results.program,
                status: task.status,
              });
            }
          });
        });
        this.rows = list;
        this.dtTrigger.next();
      }
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
