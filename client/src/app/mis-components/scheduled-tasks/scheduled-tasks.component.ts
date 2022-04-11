import {Component, OnInit} from '@angular/core';
import {AlertService} from "../../services/alert";
import {Router} from "@angular/router";
import {ScheduledTasksService} from "../../services/scheduled-tasks.service";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-scheduled-tasks',
  templateUrl: './scheduled-tasks.component.html',
  styleUrls: ['./scheduled-tasks.component.css']
})
export class ScheduledTasksComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  groupId = '';
  search = '';
  activeRow: any;
  runningJobs = [];
  allJobs = [];
  scheduledTasks: Object[];
  searchValue = '';

  constructor(private alertService: AlertService,
              private router: Router,
              private scheduledTasksService: ScheduledTasksService) {
  }

  ngOnInit(): void {
    this.reloadTable();
  }

  reloadTable() {
    this.scheduledTasksService.getScheduledTasks().subscribe((data) => {
      console.log("tasks",data)
      this.scheduledTasks = data['taskdef'];
      this.allJobs = data['jobs'];
      this.runningJobs = data['runningJobs'];
    });
  }

  runJobNow(taskName) {
    const params = new HttpParams()
      .set('taskName', taskName);
    this.scheduledTasksService.runScheduledTask(params).subscribe((data) => {
      this.reloadTable();
      this.alertService.success(`${taskName} has been triggered`);
    }, error => {
      this.alertService.error(`${taskName} has not been triggered`);
    });
  }

  unScheduleJob(taskName) {
    const params = new HttpParams()
      .set('taskName', taskName);
    this.scheduledTasksService.unScheduleTask(params).subscribe((data) => {
      this.reloadTable();
      this.alertService.success(`${taskName} has been unscheduled`);
    }, error => {
      this.alertService.error(`${taskName} has not been unscheduled`);
    });
  }


  entriesChange($event) {
    this.entries = $event.target.value;
    this.reloadTable();
  }

  filterTable($event) {
    this.search = $event.target.value;
    this.reloadTable();
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  onChangeSearch(event) {
    console.log(event.target.value)
    if (!event.target.value)
      this.searchValue = ''
    else {
      this.searchValue = event.target.value;
    }
    this.reloadTable();
  }

}
