import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ReplacePipe} from "../../pipes/replace-pipe";
import {FormSettingService} from "../../services/form-setting.service";

@Component({
  selector: 'app-form-setting',
  templateUrl: './form-setting.component.html',
  styleUrls: ['./form-setting.component.css']
})
export class FormSettingComponent implements OnInit {

  formName: String;
  entries: number = 10;
  selected: any[] = [];
  activeRow: any;
  rows: Object[];
  temp: Object[];
  editing = {};
  formData: any;
  formTable: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formSettingService: FormSettingService) {
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable(event) {
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

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.formTable = params.formtable;
      this.getFormSettingData(this.formTable);
    });
  }

  getFormSettingData(formtable: String) {
    const params = new HttpParams()
      .set('formtable', `${formtable}`);

    this.formSettingService.getFormSettings(params).subscribe((data) => {
      this.formName = new ReplacePipe().transform(data['form_name'], '_', ' ');
      this.temp = [...data['data']];
      this.rows = data['data'];
    }, error => console.log(error));
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    let settingId = this.rows[rowIndex]['id'];
    this.formData = this.rows[rowIndex];
    this.formSettingService.updateFormSettings(settingId, this.formData).subscribe((data) => {
    }, error => console.log(error));
  }

  onSearch(event) {
    this.getFormSettingData(this.formTable);
  }
}
