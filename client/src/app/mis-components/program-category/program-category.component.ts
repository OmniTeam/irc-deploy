import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../services/alert";
import {ProgramCategoryService} from "../../services/program-category.service";

@Component({
  selector: 'app-program-category',
  templateUrl: './program-category.component.html',
  styleUrls: ['./program-category.component.css']
})
export class ProgramCategoryComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  groupId = '';
  search = '';
  groups;
  private searchValue = '';
  categories: any
  submitted = false;
  activeRow: any;
  rows: Object[];
  temp: Object[];
  constructor(private route: ActivatedRoute,
              private router: Router,
              private alertService: AlertService,
              private programCategoryService: ProgramCategoryService) { }

  ngOnInit(): void {
    this.reloadTable();
  }

  reloadTable() {
    this.programCategoryService.getProgramCategories().subscribe((data) => {
      this.temp = [...data];
      this.rows = data;
    });
  }

  createProgramCategory() {
    this.router.navigate(['/programCategory/create/']);
  }

  editProgramCategory(row) {
    const id = row.id;
    this.router.navigate(['/programCategory/edit/'+ id]);
  }

  deleteProgramCategory(row) {
    const deletedRow = row.id;
    if (confirm('Are you sure to delete this Program Category?')) {
      this.programCategoryService.deleteProgramCategory(deletedRow).subscribe((result) => {
          this.alertService.warning(`Program Category has been  deleted `);
          this.router.navigate(['/programCategory']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Program Category could not be deleted`);
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
}
