import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {EntityService} from "../../services/entity.service";
import {SelectionType} from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})
export class EntitiesComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  activeRow: any;
  rows: Object[];
  enableLinkToForm = false;
  enableAddNewView = false;
  SelectionType = SelectionType;

  constructor(private router: Router, private entityService: EntityService) {
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value;
    this.rows = this.rows.filter(function (d) {
      for (let key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.enableLinkToForm = true;
    this.enableAddNewView = true;
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  ngOnInit(): void {
    this.entityService.getEntities().subscribe((data) => {
      console.log(data);
      let rowData = []
      for (let record of data) {
        let rowRecord = {};
        rowRecord['id'] = record.id;
        rowRecord['name'] = record.name;
        rowRecord['tableName'] = record.tableName;
        rowRecord['dateCreated'] = record.dateCreated;
        rowRecord['entityViews'] = this.getGroupEntityViews(record.entityViews);
        rowData.push(rowRecord);
      }
      this.rows = rowData;
    }, error => console.log(error));
  }

  createNewEntity() {
    this.router.navigate(['/createEntity']);
  }

  linkToForm() {
    let entityId = this.selected[0].id;
    this.router.navigate(['/linkForm', entityId]);
  }

  createNewView() {
    let entityId = this.selected[0].id;
    this.router.navigate(['/createEntityView', entityId]);
  }

  getGroupEntityViews(entityViews): string {
    let d = [];
    for (let view of entityViews) {
      let viewName = '<a routerLink="/entityView/' + view.id + '">' + view.name + '</a>';
      d.push(viewName);
    }
    return d.join(", ");
  }
}
