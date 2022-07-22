import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EntityService} from "../../../services/entity.service";
import {HttpParams} from "@angular/common/http";
import {ReplacePipe} from "../../../pipes/replace-pipe";
import {Subject} from "rxjs";
import {EntityFormFieldMap} from "../../../models/entity";

@Component({
  selector: 'app-link-form',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.css']
})
export class LinkFormComponent implements OnInit {

  entityName = "";
  entries = 5;
  selected: any[] = [];
  activeRow: any;
  rows: EntityFormFieldMap[] = [];
  columns: any;
  entityId = "";
  formInputConfigs: any;
  submitted = false;
  forms: any;
  editing = {};
  formData: any;
  dtOptions: any = {};
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private entityService: EntityService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entityId = params.id;
      this.getEntityFields();
    });

    this.dtOptions = {
      pagingType: "numbers",
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
      processing: true,
      responsive: true,
      dom: 'lfBrtip',
      buttons: [
        {
          text: '<i class="fas fa-file-csv" style="color: green; font-size: 20px;"></i>&nbsp;&nbsp;Export to CSV',
          extend: 'csvHtml5',
          title: 'Entity MAP FIELDS'
        },
        {
          text: '<i class="far fa-file-excel" style="color: green; font-size: 20px;"></i>&nbsp;&nbsp;Export to Excel',
          extend: 'excelHtml5',
          title: 'Entity MAP FIELDS'
        }
      ]
    };
  }

  getEntityFields() {
    const params = new HttpParams()
      .set('id', this.entityId);
    this.entityService.getEntityFields(params).subscribe((data) => {
      this.entityName = new ReplacePipe().transform(data.entity['name'], '_', ' ');
      this.forms = this.getFormData(data.forms);
      let tableData = []
      for (const field of data.entityFields) {
        tableData.push({entityField: field.displayName});
      }
      this.rows = tableData;
      this.dtTrigger.next();
    }, error => console.log(error));
  }

  getFormData(array) {
    const forms = [];
    for (const form of array) {
      const formProperties = {};
      formProperties['value'] = form['id'];
      formProperties['name'] = form['displayName'];
      forms.push(formProperties);
    }
    return forms;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
