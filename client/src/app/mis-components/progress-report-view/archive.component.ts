import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ReportFormService} from "../../services/report-form.service";
import {TaskListService} from "../../services/task-list.service";
import {HttpParams} from "@angular/common/http";
import {WorkPlanService} from "../../services/work-plan-setup.service";
import {AlertService} from "../../services/alert";
import {Subject} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  workplanId: any;
  archiveList: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskListService:TaskListService,
    private workPlanService: WorkPlanService,
    private modalService: NgbModal,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.workPlanService.getWorkPlan().subscribe(data => {
      this.rows = data;
      this.dtTrigger.next();
    }, error => console.log(error));

    this.dtOptions = {
      pagingType: "numbers",
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      processing: true,
      responsive: true,
      dom: 'lfBrtip',
    };
  }

  deleteRecord(id) {
    if (confirm('Are you sure to delete this Work Plan Record?')) {
      this.workPlanService.deleteWorkPlanRecord(id).subscribe((result) => {
          this.alertService.warning(`Staff Work plan Record has been  deleted `);
          this.reloadTableData();
        }, error => {
          this.alertService.error(`Staff Work plan Record could not be deleted`);
        }
      );
    }
  }

  private reloadTableData() {
    this.workPlanService.getWorkPlan().subscribe(data => {
      this.rows = data;
    }, error => console.log(error));
  }

  archiveRecord(id, archive) {
    const params = new HttpParams().set('id', id);
    this.workplanId = id;
    this.taskListService.getArchiveRecordDetails(params).subscribe(data => {
      this.archiveList = data;
      this.disable = true;
    });
    this.modalService.open(archive, {scrollable: true,size: 'xl'});

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
