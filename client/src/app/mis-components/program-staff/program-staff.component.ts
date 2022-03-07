import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../services/alert";
import {ProgramStaffService} from "../../services/program-staff.service";

@Component({
  selector: 'app-program-staff',
  templateUrl: './program-staff.component.html',
  styleUrls: ['./program-staff.component.css']
})
export class ProgramStaffComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  groupId = '';
  search = '';
  private searchValue = '';
  submitted = false;
  activeRow: any;
  staffs: any;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private alertService: AlertService,
              private programStaffService : ProgramStaffService) { }

  ngOnInit(): void {
    this.reloadTable();
  }

  reloadTable() {
    this.programStaffService.getProgramStaffs().subscribe((data) => {
      this.staffs = data;
    });
  }

  createProgramStaff() {
    this.router.navigate(['/programStaff/create/']);
  }

  editProgramStaff(row) {
    const id = row.id;
    this.router.navigate(['/programStaff/edit/'+ id]);
  }

  deleteProgramStaff(row) {
    const deletedRow = row.id;
    if (confirm('Are you sure to delete this Program Staff?')) {
      this.programStaffService.deleteProgramStaff(deletedRow).subscribe((result) => {
          this.alertService.warning(`Program Staff has been  deleted `);
          this.router.navigate(['/programStaff']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Program Staff could not be deleted`);
        }
      );
    }
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

}
