import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  rows: Object[];

  constructor( private router: Router, private projectService: ProjectService) {
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    let val = $event.target.value;
    this.rows = this.rows.filter(function(d) {
      for (var key in d) {
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

  ngOnInit() {
    this.projectService.getMisProjects().subscribe(data => {
      this.rows = data;
    }, error => console.log(error));
  }

}
