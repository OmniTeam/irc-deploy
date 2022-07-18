import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ReportFormService} from "../../services/report-form.service";
import {TaskListService} from "../../services/task-list.service";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {

  rows: any = [];
  temp: any = [];
  entries: number = 10;
  processId: any;
  archive: any;
  disable: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskListService:TaskListService
  ) {
  }

  ngOnInit(): void {
    //get params form route
    this.route.params.subscribe( p =>{
      this.processId = p['id'];
      const params = new HttpParams().set('id', this.processId);
      this.taskListService.getArchiveRecordDetails(params).subscribe(data => {
        this.archive = data;
        this.disable = true;
        this.disable = this.archive[0].staffId == null || this.archive[0].staffId == undefined;
        console.log("archive",this.archive)
      });
    });
  }

  getDate(date) {
    return new Date(date);
  }

  reloadTable() {
    this.taskListService.getArchivedRecords().subscribe(data => {
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

  opeForm(taskId) {

  }
}
