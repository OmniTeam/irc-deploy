import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormService} from "../../services/form.service";
import {Project} from "../../models/project";
import {Subject} from "rxjs";
import {Form} from "../../models/form";
import {AlertService} from "../../services/alert";

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
  temp: Object[];
  editing = {};
  formData: any;

  constructor( private router: Router,
               private alertService: AlertService,
               private formService: FormService) {
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  onChangeSearch(event) {
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
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  ngOnInit() {
    this.reloadTable();
  }

  reloadTable() {
    this.formService.getForms().subscribe(data => {
      this.temp = [...data];
      this.rows = data;
    }, error => console.log(error));
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    let formId = this.rows[rowIndex]['id'];
    this.formData = this.rows[rowIndex];
    this.formService.updateForm(formId, this.formData).subscribe((data) => {
      console.log(data);
    }, error => console.log(error));
  }

  deleteForm(row) {
    const deletedRow = row.id;
    if (confirm('Are you sure to delete this Form?')) {
      this.formService.deleteForm(deletedRow).subscribe((result) => {
          this.alertService.warning(`Form has been  deleted `);
          this.router.navigate(['/forms']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Form could not be deleted`);
        }
      );
    }
  }

  onSearch(event) {
    this.reloadTable();
  }
}
