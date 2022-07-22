import { Component, OnInit } from '@angular/core';
import {SelectionType} from '@swimlane/ngx-datatable';
import {ActivatedRoute, Router} from "@angular/router";
import {EntityService} from "../../services/entity.service";
import {AlertService} from "../../services/alert";

@Component({
  selector: 'app-entity-views',
  templateUrl: './entity-views.component.html',
  styleUrls: ['./entity-views.component.css']
})
export class EntityViewsComponent implements OnInit {

  rows: Object[];
  temp: Object[];
  private searchValue = '';
  entries: number = 10;
  selected: any[] = [];
  activeRow: any;
  SelectionType = SelectionType;
  search = '';
  enableAddNewViewFilter = false;
  entityViewId: any;
  entityId: any;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private entityService: EntityService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.reloadTable();
  }
  onCheckboxChangeFn(event) {
    this.enableAddNewViewFilter = !!event.target.checked;
  }

  createNewViewFilter() {
    this.router.navigate(['/entityViewFilter/create/' + this.entityViewId]);
  }

  editEntityView(row) {
    let entityViewId = row.id;
    this.router.navigate(['/entityView/edit/' + this.entityId + '/' + entityViewId]);
  }

  showEntityView(row) {
    let entityViewId = row.id;
    this.router.navigate(['/entityView/showData/' + entityViewId]);
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

  reloadTable() {
    this.entityService.getEntityViews().subscribe((data) => {
      let rowData = []
      for (let record of data) {
        let rowRecord = {};
        rowRecord['id'] = record.id;
        rowRecord['name'] = record.name;
        rowRecord['tableName'] = record.tableName;
        rowRecord['description'] = record.description;
        rowRecord['dateCreated'] = record.dateCreated;
        rowRecord['entityId'] = record.entityId;
        rowRecord['entityViewFilters'] = this.groupEntityViewFilters(record.entityViewFilters);
        rowData.push(rowRecord);
        this.entityId = record.entityId;
      }
      this.temp = [...rowData];
      this.rows = rowData;
    }, error => console.log(error));
  }

  groupEntityViewFilters(entityViewFilters): string {
    let d = [];
    for (let view of entityViewFilters) {
      let viewName = view.name;
      d.push(viewName);
    }
    return d.join(", ");
  }

  entriesChange(event) {
    let val = event.target.value.toLowerCase();
    // update the rows
    this.rows = this.temp.filter(function (d) {
      for (const key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    if (selected) {
      this.entityViewId = this.selected[0].id
    }
  }

  onSearch(event) {
    this.reloadTable();
  }

}
