import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {EntityService} from "../../services/entity.service";
import {AlertService} from "../../services/alert";
import {HttpParams} from "@angular/common/http";
import {SelectionType} from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})
export class EntitiesComponent implements OnInit {

  rows: Object[];
  submitted = false;
  private searchValue = '';
  enableLinkToForm = false;
  enableAddNewView = false;
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
  entityId: any;
  constructor(private router: Router,
              private entityService: EntityService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.pageCallback({offset: 50});
  }

  onCheckboxChangeFn(event) {
    this.enableAddNewView = !!event.target.checked;
  }

  createNewEntity() {
    this.router.navigate(['/createEntity']);
  }

  linkToForm(entityId: any) {
    this.router.navigate(['/linkForm', entityId]);
  }

  createNewView() {
    this.router.navigate(['/createEntityView', this.entityId]);
  }

  getGroupEntityViews(entityViews): string {
    let d = [];
    for (let view of entityViews) {
      let viewName = view.name;
      d.push(viewName);
    }
    return d.join(", ");
  }

  deleteEntity(row) {
    let entityId = row.id
    if (confirm('Are you sure to delete this Entity?')) {
      this.entityService.deleteEntity(entityId).subscribe((result) => {
          this.alertService.warning(`Entity has been  deleted `);
          this.router.navigate(['/entity']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Entity could not be deleted`)
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

    this.entityService.getEntities().subscribe((data) => {
      let rowData = []
      for (let record of data) {
        let rowRecord = {};
        rowRecord['id'] = record.id;
        rowRecord['name'] = record.name;
        rowRecord['tableName'] = record.tableName;
        rowRecord['prefix'] = record.prefix;
        rowRecord['dateCreated'] = record.dateCreated;
        rowRecord['entityViews'] = this.getGroupEntityViews(record.entityViews);
        rowData.push(rowRecord);
      }
      this.rows = rowData;
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
    if (selected) {
      this.entityId = this.selected[0].id
    }
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
