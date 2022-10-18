import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../services/alert";
import {ProgramStaffService} from "../../services/program-staff.service";
import {ActivityReportService} from "../../services/activity-report.service";
import {HttpParams} from "@angular/common/http";
import {AuthService} from '../../services/auth.service';
import {TaskListService} from "../../services/task-list.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-activity-report',
  templateUrl: './activity-report.component.html',
  styleUrls: ['./activity-report.component.css']
})
export class ActivityReportComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  groupId = '';
  search = '';
  private searchValue = '';
  submitted = false;
  activeRow: any;
  staffs: any;
  activity: any;
  userRole: any;
  activityId: any;
  disable: boolean;
  archiveList: any;
  activityList: any;
  isLoading: boolean;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private activityReportService: ActivityReportService,
    private programStaffService: ProgramStaffService,
    private authService: AuthService,
    private modalService: NgbModal,
    private taskListService: TaskListService
  ) {
  }

  ngOnInit(): void {
    this.reloadTable();
    this.getStaff();
    this.userRole = this.authService.getUserRoles()
  }

  reloadTable() {
    this.isLoading = true;
    this.activityReportService.getActivityReport().subscribe((data) => {
      this.activity = data;
      this.isLoading = false;
    });
  }

  getResults() {
    let results: any = []
    this.activity.forEach((data) => {
      const params = new HttpParams().set('budgetLineId', data.budgetLine);
      this.activityReportService.getBudgetLine(params).subscribe((item) => {
        results.push({
          budgetLine: item,
          designation: data.designation,
          location: data.location,
          milestone: data.milestone,
          startDate: data.startDate,
          endDate: data.endDate
        })
      });
    })
    return results
  }

  getStaff() {
    this.programStaffService.getProgramStaffs().subscribe((data) => {
      this.staffs = data;
    });
  }

  createActivityReport() {
    this.router.navigate(['activity-create']);
  }

  editActivityReport(row) {
    const id = row.id;
      this.router.navigate(['/activityReport/edit/' + id +'/'+ false]);
  }

  deleteActivityReport(row) {
    const deletedRow = row.id;
    if (confirm('Are you sure to delete this Activity Report?')) {
      this.activityReportService.deleteCurrentActivityReport(deletedRow).subscribe((result) => {
          this.alertService.warning(`Activity Report has been  deleted `);
          this.router.navigate(['activity-list']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Activity Report could not be deleted`);
        }
      );
    }
  }

  downloadActivityReports(): void {
    const fileName = 'Activity_Reports.xlsx';
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.activity);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
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
    if (!event.target.value)
      this.searchValue = ''
    else {
      this.searchValue = event.target.value;
    }
    this.reloadTable();
  }

  getDate(date) {
    return new Date(date);
  }


  getArchiveRecords(id, archive) {
    const params = new HttpParams().set('id', id);
    this.activityId = id;
    this.activityReportService.getCurrentActivityReport(this.activityId).subscribe(data => {
      this.activityList = data;
      console.log("activityList", this.activityList);
    })
    this.taskListService.getArchiveRecordDetails(params).subscribe(data => {
      this.archiveList = data;
      this.disable = true;
    });
    this.modalService.open(archive, {scrollable: true,size: 'xl'});
    // this.router.navigate(['/archive/' + id]);
  }
}
