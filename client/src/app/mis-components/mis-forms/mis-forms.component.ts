import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormService} from "../../services/form.service";

@Component({
  selector: 'app-mis-forms',
  templateUrl: './mis-forms.component.html',
  styleUrls: ['./mis-forms.component.css']
})
export class MisFormsComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  activeRow: any;
  rows: Object[];
  editing = {};
  formData: any;

  constructor( private router: Router, private formService: FormService) {
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
    this.formService.getForms().subscribe(data => {
      this.rows = data;
    }, error => console.log(error));
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    console.log(this.rows[rowIndex][cell]);
    console.log(event.target.value);

    this.rows = [...this.rows];
    let formId = this.rows[rowIndex]['id'];
    this.formData = this.rows[rowIndex];
    this.formService.updateForm(formId, this.formData).subscribe((data) => {
      console.log(data);
    }, error => console.log(error));
  }
}
