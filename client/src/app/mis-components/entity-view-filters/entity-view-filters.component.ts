import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../services/alert";
import {EntityViewFiltersService} from "../../services/entity-view-filters.service";

@Component({
  selector: 'app-entity-view-filters',
  templateUrl: './entity-view-filters.component.html',
  styleUrls: ['./entity-view-filters.component.css']
})
export class EntityViewFiltersComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  groupId = '';
  search = '';
  groups;
  private searchValue = '';
  filters: any
  submitted = false;
  activeRow: any;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private alertService: AlertService,
              private entityViewFiltersService: EntityViewFiltersService) { }

  ngOnInit(): void {
    this.reloadTable();
  }

  reloadTable() {
    this.entityViewFiltersService.getEntityViewFilters().subscribe((data) => {
      this.filters = data;
    });
  }

  editEntityViewFilter(row) {
    const id = row.id;
    const entityViewId = row.entityView.id;
    this.router.navigate(['/entityViewFilter/edit/'+ entityViewId + '/' + id]);
  }

  deleteEntityViewFilter(row) {
    const deletedRow = row.id;
    if (confirm('Are you sure to delete this Entity View Filter?')) {
      this.entityViewFiltersService.deleteEntityViewFilter(deletedRow).subscribe((result) => {
          this.alertService.warning(`Entity View Filter has been  deleted `);
          this.router.navigate(['/entityViewFilter']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Entity View Filter could not be deleted`);
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
