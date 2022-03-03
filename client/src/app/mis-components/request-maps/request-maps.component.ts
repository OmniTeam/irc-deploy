import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RequestMapsService} from "../../services/request-maps.service";
import {AlertService} from "../../services/alert";

@Component({
  selector: 'app-request-maps',
  templateUrl: './request-maps.component.html',
  styleUrls: ['./request-maps.component.css']
})
export class RequestMapsComponent implements OnInit {


  entries: number = 10;
  selected: any[] = [];
  groupId = '';
  search = '';
  groups;
  private searchValue = '';
  requestMaps: any
  submitted = false;
  activeRow: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private alertService: AlertService,
              private requestMapsService: RequestMapsService) {
  }

  ngOnInit(): void {
    this.reloadTable();
  }

  reloadTable() {
    this.requestMapsService.getRequestMaps().subscribe((data) => {
      this.requestMaps = data;
    });
  }

  createRequestMap() {
    this.router.navigate(['/requestMaps/create/']);
  }

  editRequestMap(row) {
    const id = row.id;
    this.router.navigate(['/requestMaps/edit/'+ id]);
  }

  deleteRequestMap(row) {
    const deletedRow = row.id;
    if (confirm('Are you sure to delete this Request Map?')) {
      this.requestMapsService.deleteRequestMaps(deletedRow).subscribe((result) => {
          this.alertService.warning(`Request Map has been  deleted `);
          this.router.navigate(['/requestMaps']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Request Map could not be deleted`);
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
