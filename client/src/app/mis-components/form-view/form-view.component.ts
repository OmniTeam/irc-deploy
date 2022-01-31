import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {FormViewService} from "../../services/form-view.service";
import {CommentNode} from '../comments/comments.component';
import * as $ from "jquery";

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.css']
})

export class FormViewComponent implements OnInit {

  rows: Object[];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  comments:Array<CommentNode> = [];
  isSubmitVisible: boolean;
  isReviewVisible: boolean;
  isApproveVisible: boolean;
  openCommentsPopup: boolean;
  openRecommendationsPopup: boolean;
  openPopup: boolean;
  organisationalInfo = {
      id: 'asdaasrsgsdgfssgs',
      program: 'Adolescent Girl Power Program',
      cluster_organization: 'Empowered Gals of Busano',
      acronym_name: 'EGB',
      organization_type: 'CBO',
      legal_status: 'Registered NGO',
      contact_person: 'Musamali Jacob',
      physical_address: 'Khatwelatwela, Nyondo Parish',
      postal_address: 'None',
      email: 'egb@gmail.com',
      website: 'https://empoweredbusano.org/',
      country: 'Uganda',
      city: 'Mbale'
    };
  projectInfo = {
    id: 'akhfbkabsdkfjbsjf',
    reporting_period: '22 June 2022 to 21 Sep 2022',
    grant_start_date: '21/Mar/2022',
    grant_end_date: '21/Mar/2022',
    total_grant_amount: '45,000 USD',
    amount_transferred: '12,000',
    amount_utilized: '',
    balance_spent_overspend: ''
  };
  performance = [
    {
      id: 'adaggfdfgsgsfgsfsd',
      output_indicators: 'No of safe spaces established within the community',
      overall_target: '500',
      cumulative_achievement: '200',
      quarter_target: '40',
      quarter_achievement: '32',
      percentage_achievement: '67%',
      comment_on_result: ''
    },
    {
      id: 'gddagdyrtaegssag',
      output_indicators: 'No of Adolescent girls utilising safe spaces',
      overall_target: '400',
      cumulative_achievement: '120',
      quarter_target: '50',
      quarter_achievement: '22',
      percentage_achievement: '70%',
      comment_on_result: ''
    }
  ];
  financialReport = [
    {
      id: 'fdadasdasdasd',
      budget_line: 'Staff salaries and related charges',
      approved_budget: '30000',
      total_advanced: '20000',
      expense_to_date: '15000',
      quarter_expenses: '',
      variance: '4%',
      reason_for_variance: ''
    },
    {
      id: 'asdsafsagsgasgfds',
      budget_line: 'Direct support to target population',
      approved_budget: '30000',
      total_advanced: '20000',
      expense_to_date: '15000',
      quarter_expenses: '',
      variance: '25%%',
      reason_for_variance: ''
    }
  ];

  constructor( private router: Router, private formViewService: FormViewService) {
    this.comments =  [new CommentNode("This is my comment", "Mr.Rwele")]
  }

  ngOnInit(): void {
    this.formViewService.getForms().subscribe(data => {
      console.log(data);
      this.rows = data;
      this.isSubmitVisible = true;
      this.isReviewVisible = false;
      this.isApproveVisible = false;
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

    var table;
    $(document).ready(function () {
      table = $('#financial').DataTable();
      table.MakeCellsEditable({
        "onUpdate": myCallbackFunction,
        "inputCss":'form-control',
        "columns": [0,1,2,3],
        "allowNulls": {
          "columns": [3],
          "errorClass": 'error'
        },
        "confirmationButton": { // could also be true
          "confirmCss": 'btn btn-success',
          "cancelCss": 'btn btn-danger'
        },
        "inputTypes": [
          {
            "column": 0,
            "type": "text",
            "options": null
          },
          {
            "column":1,
            "type": "list",
            "options":[
              { "value": "1", "display": "Beaty" },
              { "value": "2", "display": "Doe" },
              { "value": "3", "display": "Dirt" }
            ]
          },
        ]
      });

    });

    function myCallbackFunction (updatedCell, updatedRow, oldValue) {
      console.log("The new value for the cell is: " + updatedCell.data());
      console.log("The old value for that cell was: " + oldValue);
      console.log("The values for each cell in that row are: " + updatedRow.data());
    }

    function destroyTable() {
      if ($.fn.dataTable.isDataTable('#myAdvancedTable')) {
        table.destroy();
        table.MakeCellsEditable("destroy");
      }
    }

  }

  summaryComments = [];
  quarterExpenses = [];
  variance = [];
  reasonForVariance = [];
  item = {};

  onKey(event) {
    this.item = {
      id: event.target.id,
      value: event.target.value
    }

    switch (event.target.name) {
      case "summaryComment":
        this.checkReplace(this.summaryComments ,this.item)
        break;
      case "quarter_expense":
        this.quarterExpenses.push(this.item);
        break;
      case "variance":
        this.variance.push(this.item);
        break;
      case "reason_for_variance":
        this.reasonForVariance.push(this.item);
        break;
    }
  }

  checkReplace(list, item) {
    if(list.length!==0) {
      console.log("includes:  ", list.some(x=>x.id===item.id));
      if (list.some(x=>x.id===item.id)) {
        list.forEach(function (comment) {
          if (comment.id === item.id) comment.value = item.value
        });
      } else list.push(item);
    } else list.push(item);
  }

  submitReport() {

    console.log("summaryComments: ", this.summaryComments);
    this.summaryComments.forEach(function (comment) {
      console.log("Comment: " + comment.value);
    });

    this.changeForm('Review');
  }

  changeForm(formName) {
    this.isSubmitVisible = false;
    this.isReviewVisible = false;
    this.isApproveVisible = false;
    if(formName=='Submit') this.isSubmitVisible = true;
    if(formName=='Review') this.isReviewVisible = true;
    if(formName=='Approve') this.isApproveVisible = true;
    window.scroll(0,0);
  }

  viewComments(): void {
    this.openCommentsPopup = !this.openCommentsPopup;
    this.openPopup = this.openCommentsPopup;
  }

  viewRecommendations(): void {
    this.openRecommendationsPopup = !this.openRecommendationsPopup;
    this.openPopup = this.openRecommendationsPopup;
  }
}
