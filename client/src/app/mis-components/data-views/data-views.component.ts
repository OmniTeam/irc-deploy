import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../services/alert";
import {DataViewService} from "../../services/data-view.service";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-data-views',
  templateUrl: './data-views.component.html',
  styleUrls: ['./data-views.component.css']
})
export class DataViewsComponent implements OnInit {

  rows: Object[];
  temp: Object[];
  private searchValue = '';
  entries: number = 10;
  selected: any[] = [];
  activeRow: any;
  search = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataViewService: DataViewService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.reloadTable();
  }

  reloadTable() {
    this.dataViewService.getDataViews().subscribe((data) => {
      this.temp = [...data];
      this.rows = data;
    }, error => console.log(error));
  }

  createNewDataView() {
    this.router.navigate(['/dataView/create']);
  }

  editDataView(row) {
    let dataViewId = row.id;
    this.router.navigate(['/dataView/edit/' + dataViewId]);
  }

  showDataView(row) {
    let dataViewId = row.id;
    this.router.navigate(['/dataView/showData/' + dataViewId]);
  }

  deleteDataView(row) {
    let dataViewId = row.id
    if (confirm('Are you sure to delete this Data View?')) {
      this.dataViewService.deleteDataView(dataViewId).subscribe((result) => {
          this.alertService.warning(`Data View has been  deleted `);
          this.router.navigate(['/dataView']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Data View could not be deleted`);
        }
      );
    }
  }

  syncDataViewToMetabase(row) {
    let dataViewId = row.id;
    const params = new HttpParams()
      .set('id', dataViewId);
    if (confirm('Are you sure to sync this Data View?')) {
      this.dataViewService.syncViewToMetabase(params).subscribe((result) => {
          this.alertService.warning(`Data View has successfully synced to Metabase `);
          this.router.navigate(['/dataView']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Data View could not be synced to Metabase`);
        }
      );
    }
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  entriesChange(event) {
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

  filterTable($event) {
    let val = $event.target.value;
    this.rows = this.rows.filter(function (d) {
      for (const key in d) {
        if (d[key]?.toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

}
