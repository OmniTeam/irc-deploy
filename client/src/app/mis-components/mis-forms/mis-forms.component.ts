import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormService} from "../../services/form.service";

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
  rows: Object[];
  constructor( private router: Router, private formService: FormService) { }

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

  ngOnInit(): void {
    this.formService.getForms().subscribe(data => {
      this.rows = data;
    }, error => console.log(error));
  }

  viewFormData(valObj: any) {
    this.router.navigate(['forms/data', valObj['name']]);
  }
}
