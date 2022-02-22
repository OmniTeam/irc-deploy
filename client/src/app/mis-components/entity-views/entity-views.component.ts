import { Component, OnInit } from '@angular/core';
import {SelectionType} from '@swimlane/ngx-datatable';
import {ActivatedRoute, Router} from "@angular/router";
import {EntityService} from "../../services/entity.service";
import {AlertService} from "../../services/alert";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-entity-views',
  templateUrl: './entity-views.component.html',
  styleUrls: ['./entity-views.component.css']
})
export class EntityViewsComponent implements OnInit {

  rows: Object[];
  private searchValue = '';
  entries: number = 500;
  selected: any[] = [];
  activeRow: any;
  SelectionType = SelectionType;
  search = '';
  page = {
    limit: this.entries,
    count: 0,
    offset: 50,
    orderBy: 'title',
    orderDir: 'desc'
  };
  constructor(private route: ActivatedRoute,
              private router: Router,
              private entityService: EntityService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.pageCallback({offset: 50});
  }

  deleteEntityView(row) {
    let entityViewId = row.id
    if (confirm('Are you sure to delete this Entity View?')) {
      this.entityService.deleteEntityView(entityViewId).subscribe((result) => {
          this.alertService.warning(`Entity View has been  deleted `);
          this.router.navigate(['/entityView']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Entity View could not be deleted`);
        }
      );
    }
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

  reloadTable() {
    // NOTE: those params key values depends on your API!
    const params = new HttpParams()
      .set('max', `${this.page.offset}`)
      .set('search', `${this.searchValue}`);

    this.entityService.getEntityViews().subscribe((data) => {
      this.rows = data;
    }, error => console.log(error));
  }

  entriesChange($event) {
    this.entries = $event.target.value;
    this.reloadTable();
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  filterTable($event) {
    this.search = $event.target.value;
    this.reloadTable();
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  pageCallback(pageInfo: { count?: number, pageSize?: number, limit?: number, offset?: number }) {
    this.page.offset = pageInfo.offset;
    this.reloadTable();
  }

  sortCallback(sortInfo: { sorts: { dir: string, prop: string }[], column: {}, prevValue: string, newValue: string }) {
    // there will always be one "sort" object if "sortType" is set to "single"
    this.page.orderDir = sortInfo.sorts[0].dir;
    this.page.orderBy = sortInfo.sorts[0].prop;
    this.reloadTable();
  }

}
