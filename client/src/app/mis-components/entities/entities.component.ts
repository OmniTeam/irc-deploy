import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {EntityService} from "../../services/entity.service";

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

  constructor( private router: Router, private entityService: EntityService) { }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    let val = $event.target.value;
    this.rows = this.rows.filter(function(d) {
      for (let key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
  ngOnInit(): void {
    this.entityService.getEntities().subscribe((data) => {
      this.rows = data;
    }, error => console.log(error));
  }

  createNewEntity() {
    this.router.navigate(['/createentities']);
  }

  linkToForm() {

  }

  createNewView() {

  }

}
