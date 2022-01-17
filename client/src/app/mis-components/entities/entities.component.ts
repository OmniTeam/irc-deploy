import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {EntityService} from "../../services/entity.service";
import {Entity} from "../../models/entity";
import {Subject} from "rxjs";

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})
export class EntitiesComponent implements OnInit {

  rows: Entity[] = [];
  enableLinkToForm = false;
  enableAddNewView = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private router: Router,
              private entityService: EntityService) {
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
      this.dtTrigger.next();
    }, error => console.log(error));

    this.dtOptions = {
      pagingType: "numbers",
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
      processing: true,
      responsive: true,
      dom: 'lfBrtip',
      columnDefs: [{
        orderable: false,
        className: 'select-checkbox',
        targets: 6
      }],
      select: {
        style: 'os',
      },
      buttons: [
        {
          extend: 'selectedSingle',
          text: 'Link To Form',
          action: ( e, dt, button, config ) => {
            let entityId = dt.row( { selected: true } ).data()[0];
            this.linkToForm(entityId);
          }
        },
        {
          extend: 'selectedSingle',
          text: 'Add New View',
          action: ( e, dt, button, config ) => {
            let entityId = dt.row( { selected: true } ).data()[0];
            this.createNewView(entityId);
          }
        },

        {
          text: 'Create Entity',
          action: ( e, dt, button, config ) => {
            this.createNewEntity();
          }
        },
        {
          text: '<i class="fas fa-file-csv" style="color: green;"></i>&nbsp;&nbsp;Export to CSV',
          extend: 'csvHtml5',
          title: 'Entity'
        },
        {
          text: '<i class="far fa-file-excel" style="color: green;"></i>&nbsp;&nbsp;Export to Excel',
          extend: 'excelHtml5',
          title: 'Entity'
        }
      ]
    };
  }

  createNewEntity() {
    this.router.navigate(['/createEntity']);
  }

  linkToForm(entityId: any) {
    this.router.navigate(['/linkForm', entityId]);
  }

  createNewView(entityId: any) {
    this.router.navigate(['/createEntityView', entityId]);
  }

  getGroupEntityViews(entityViews): string {
    let d = [];
    for (let view of entityViews) {
      let viewName = view.name;
      d.push(viewName);
    }
    return d.join(", ");
  }
}
