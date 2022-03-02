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
  entries: number = 10;
  selected: any[] = [];
  activeRow: any;
  SelectionType = SelectionType;
  search = '';
  entityId: any;
  constructor(private router: Router,
              private entityService: EntityService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.reloadTable();
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
    if (!event.target.value)
      this.searchValue = ''
    else {
      this.searchValue = event.target.value;
    }
    this.reloadTable();
  }

  reloadTable() {
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
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  filterTable($event) {
    this.search = $event.target.value;
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    if (selected) {
      this.entityId = this.selected[0].id
    }
  }
}
