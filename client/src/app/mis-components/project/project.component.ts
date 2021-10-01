import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

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
  rows: any = [
    {
      projectId: "789-90983",
      projectName: "MIRP",
      oxdId: "4",
      dateCreated: "2021/04/25",
    },
    {
      projectId: "789-90983",
      projectName: "MIRP",
      oxdId: "4",
      dateCreated: "2021/04/25",
    },
    {
      projectId: "789-90983",
      projectName: "MIRP",
      oxdId: "4",
      dateCreated: "2021/04/25",
    },
    {
      projectId: "789-90983",
      projectName: "Everflow",
      oxdId: "3",
      dateCreated: "2021/04/25",
    },
    {
      projectId: "789-90983",
      projectName: "SNV TIDE 2",
      oxdId: "5",
      dateCreated: "2021/04/26",
    },
  ];
  constructor( private router: Router,) {
    this.temp = this.rows.map((prop, key) => {
      return {
        ...prop,
        id: key
      };
    });
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    let val = $event.target.value;
    this.temp = this.rows.filter(function(d) {
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

  newProject(){
    this.router.navigate(['project/create']);
  }

  ngOnInit(): void {
  }

}
