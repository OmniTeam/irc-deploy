import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormService} from "../../services/form.service";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-form-data',
  templateUrl: './form-data.component.html',
  styleUrls: ['./form-data.component.css']
})
export class FormDataComponent implements OnInit, AfterViewInit {
  formtable;
  entries: number = 5;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  rows: Object[];
  columns: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formService: FormService) {
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value;
    this.rows = this.rows.filter(function (d) {
      for (var key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.formtable = this.route.snapshot.params['formtable'];
    const params = new HttpParams()
      .set('formtable', `${this.formtable}`);

    this.formService.getFormData(params).subscribe((data) => {
      this.rows = data;
      this.columns = this.columnMappings(data);
    }, error => console.log(error));
  }

  getUniqueColumnsFromArray(array) {
    let uniqueKeys = [];
    for (let i = 0, l = array.length; i < l; i++)
      for (let x = 0, p = Object.keys(array[i]).length; x < p; x++)
        if (uniqueKeys.indexOf(Object.keys(array[i])[x]) === -1)
          uniqueKeys.push((Object.keys(array[i])[x]));
    return uniqueKeys;
  }

  columnMappings(array) {
    let columns = []
    let uniqueColumns = this.getUniqueColumnsFromArray(array);
    for (let column of uniqueColumns) {
      let columnProperties = {};
      columnProperties['prop'] = column;
      columnProperties['name'] = this.titleCaseWord(column.trim().replaceAll('_', ' '));
      columns.push(columnProperties)
    }
    return columns;
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1);
  }
}
