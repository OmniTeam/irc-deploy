import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../services/alert";
import {ProgramService} from "../../services/program.service";

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css']
})
export class ProgramComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  groupId = '';
  search = '';
  groups;
  private searchValue = '';
  programs: any
  submitted = false;
  activeRow: any;
  rows: Object[];
  temp: Object[];
  constructor(private route: ActivatedRoute,
              private router: Router,
              private alertService: AlertService,
              private programService: ProgramService) { }

  ngOnInit(): void {
    this.reloadTable();
  }

  reloadTable() {
    this.programService.getPrograms().subscribe((data) => {
      this.temp = [...data];
      this.rows = data;
    });
  }

  createProgram() {
    this.router.navigate(['/program/create/']);
  }

  editProgram(row) {
    const id = row.id;
    this.router.navigate(['/program/edit/'+ id]);
  }

  deleteProgram(row) {
    const deletedRow = row.id;
    if (confirm('Are you sure to delete this Program?')) {
      this.programService.deleteProgram(deletedRow).subscribe((result) => {
          this.alertService.warning(`Program has been  deleted `);
          this.router.navigate(['/program']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Program could not be deleted`);
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
