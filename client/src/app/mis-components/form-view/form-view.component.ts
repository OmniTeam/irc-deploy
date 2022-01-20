import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {FormViewService} from "../../services/form-view.service";

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.css']
})
export class FormViewComponent implements OnInit {

  rows: Object[];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor( private router: Router, private formViewService: FormViewService) { }

  ngOnInit(): void {
    this.formViewService.getForms().subscribe(data => {
      console.log(data);
      this.rows = data;
      this.dtTrigger.next();
    }, error => console.log(error));

    this.dtOptions = {
      pagingType: "numbers",
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
      processing: true,
      responsive: true,
      dom: 'lfBrtip',
      buttons: []
    };

    $.fn['summary'].DataTable( {
      "scrollX": true
    } );
  }

}
