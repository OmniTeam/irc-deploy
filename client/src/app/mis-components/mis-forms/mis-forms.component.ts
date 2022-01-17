import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormService} from "../../services/form.service";
import {Project} from "../../models/project";
import {Subject} from "rxjs";
import {Form} from "../../models/form";

@Component({
  selector: 'app-mis-forms',
  templateUrl: './mis-forms.component.html',
  styleUrls: ['./mis-forms.component.css']
})
export class MisFormsComponent implements OnInit {

  rows: Form[] = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private router: Router, private formService: FormService) {
  }

  ngOnInit() {
    this.formService.getForms().subscribe(data => {
      this.rows = data;
      this.dtTrigger.next();
    }, error => console.log(error));


    this.dtOptions = {
      pagingType: "numbers",
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
      processing: true,
      responsive: true,
      dom: 'lfrtip'
    };
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
