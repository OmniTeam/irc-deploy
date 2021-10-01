import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-mis-forms',
  templateUrl: './mis-forms.component.html',
  styleUrls: ['./mis-forms.component.scss']
})
export class MisFormsComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  rows: any = [
    {
      formId: "789-90983",
      formName: "Farmer Suvery Form",
      oxdId: "4",
      dateCreated: "2021/04/25",
    },
    {
      formId: "789-90983",
      formName: "Farmer Suvery Form",
      oxdId: "4",
      dateCreated: "2021/04/25",
    },
    {
      formId: "789-90983",
      formName: "Farmer Suvery Form",
      oxdId: "4",
      dateCreated: "2021/04/25",
    },
    {
      formId: "789-90983",
      formName: "Farmer Suvery Form",
      oxdId: "3",
      dateCreated: "2021/04/25",
    },
    {
      formId: "789-90983",
      formName: "Farmer Suvery Form",
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

  ngOnInit(): void {
  }

}
