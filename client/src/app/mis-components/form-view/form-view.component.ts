import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {FormViewService} from "../../services/form-view.service";
import {CommentNode, CommentsComponent} from '../comments/comments.component';
import {CellEdit, OnUpdateCell} from '../../utilities/cell_edit';
import {FileUploadService} from '../../services/file-upload.service';
import {v4 as uuid} from 'uuid';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.css']
})

export class FormViewComponent implements OnInit, OnUpdateCell {

  @ViewChild(CellEdit) cellEdit;

  rows: Object[];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  comments: Array<CommentNode> = [];
  isSubmitVisible: boolean;
  isReviewVisible: boolean;
  isApproveVisible: boolean;
  openCommentsPopup: boolean;
  openRecommendationsPopup: boolean;
  openPopup: boolean;
  loading: boolean = false;

  radioSel:any;
  radioExpensesRealistic:string;
  radioAttachmentsVerified:string;
  radioFiguresRealistic:string;
  radioNarrativeAlign:string;
  radioInlineWithTargets:string;
  radioEvidenceSatisfactory:string;
  radioSuggestedChangesSatisfactory:string;
  radioReportsWellAligned:string;
  radioSelectedString:string;
  radioRecommedFund:string;
  radioEndOfPartnership:string;

  shortLink1: string = "";
  shortLink2: string = "";
  shortLink3: string = "";
  attachment1: string;
  attachment2: string;
  attachment3: string;
  items = [
    {name: 'Yes', value: 'yes'},
    {name: 'No', value: 'no'}
  ];
  organisationalInfo = {
    id: 'asdaasrsgsdgfssgs',
    program: 'Adolescent Girl Power Program',
    cluster_organization: 'Empowered Girls of Busano',
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
  performanceReport = [
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
      variance: '25%',
      reason_for_variance: ''
    }
  ];
  listOfComments = [
    {
      id: "fdadasddsfasdasdfdd",
      text: 'Hey hey how are you',
      user: 'Mr.Rwele',
      likes: ['super'],
      answers: [],
      datetimeCreated: '04/07/2022 06:12:21'
    },
    {
      id: 'asdsafsadfgsgasgfds',
      text: 'I do not like this report',
      user: 'Kasiga Balinda',
      likes: [],
      answers: [
        {
          id: "restrydrshdgdhhdshdfg",
          text: 'Okay, I agree with this',
          user: 'Mr.Rwele',
          likes: ['super'],
          answers: [
            {
              id: "fdadasddsfasdasdfdd",
              text: 'Hey hey how are you',
              user: 'Mr.Rwele',
              likes: [],
              answers: [],
              datetimeCreated: '04/07/2022 06:12:21'
            }
          ],
          datetimeCreated: '05/01/2022 19:12:21'
        }
      ],
      datetimeCreated: '04/01/2022 09:12:21'
    }
  ];

  constructor(private router: Router, private formViewService: FormViewService, private fileUploadService: FileUploadService, public authService: AuthService) {
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

    this.listOfComments.forEach((commentNode) => {
      this.comments.push(new CommentNode(commentNode.id, commentNode.text, commentNode.user, commentNode.likes, this.getAnswersToComments(commentNode.answers), new Date(commentNode.datetimeCreated)));
    });
  }

  getAnswersToComments(list) {
    let answers = [];
    list.forEach((answer) => {
      answers.push(new CommentNode(answer.id, answer.text, answer.user, answer.likes, this.getAnswersToComments(answer.answers), new Date(answer.datetimeCreated)));
    });
    return answers;
  }

  submitReport() {
    this.changeForm('Review');
  }

  handleFileInput(event) {
    let files: FileList = event.target.files;
    if (event.target.id === "attachment1") this.attachment1 = files.item(0).name;
    if (event.target.id === "attachment2") this.attachment2 = files.item(0).name;
    if (event.target.id === "attachment3") this.attachment3 = files.item(0).name;
    this.uploadFile(files.item(0), event.target.id);
  }

  uploadFile(file, id) {
    this.loading = !this.loading;
    console.log(file);
    this.fileUploadService.upload(file).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {

          // Short link via api response
          if (id === "attachment1") this.shortLink1 = event.link;
          if (id === "attachment2") this.shortLink2 = event.link;
          if (id === "attachment3") this.shortLink3 = event.link;

          this.loading = false; // Flag variable
        }
      }
    );
  }

  onItemChange(event){
    console.log("event name",event.target.name);
    this.radioSel = this.items.find(Item => Item.value === this.radioExpensesRealistic);
    this.radioSelectedString = JSON.stringify(this.radioSel);
    console.log("radioSelectedString",this.radioSelectedString);
  }

  changeForm(formName) {
    this.isSubmitVisible = false;
    this.isReviewVisible = false;
    this.isApproveVisible = false;
    if (formName == 'Submit') this.isSubmitVisible = true;
    if (formName == 'Review') this.isReviewVisible = true;
    if (formName == 'Approve') this.isApproveVisible = true;
    window.scroll(0, 0);
  }

  viewComments(): void {
    this.openCommentsPopup = !this.openCommentsPopup;
    this.openPopup = this.openCommentsPopup;
  }

  addComment() {
    let text = (document.getElementById("addComment") as HTMLTextAreaElement);
    if (text.value !== "") {
      this.comments.push(new CommentNode(uuid(), text.value, this.authService.getLoggedInUsername(), [], [], new Date()));
      text.value = "";
    }
  }

  viewRecommendations(): void {
    this.openRecommendationsPopup = !this.openRecommendationsPopup;
    this.openPopup = this.openRecommendationsPopup;
  }

  get performance() {
    return this.performanceReport;
  }

  get financial() {
    return this.financialReport;
  }

  saveCellValue = (value: string, key: string, rowId): void => {
    //save
    console.log("newValue", value);
    if (value !== null && value !== undefined)
      switch (key) {
        case "summaryComment":
          if (this.performanceReport.some(x => x.id === rowId)) {
            this.performanceReport.forEach(function (comment) {
              if (comment.id === rowId) comment.comment_on_result = value
            });
          }
          break;
        case "quarterExpense":
          if (this.financialReport.some(x => x.id === rowId)) {
            this.financialReport.forEach(function (item) {
              if (item.id === rowId) item.quarter_expenses = value
            });
          }
          break;
        case "variance":
          if (this.financialReport.some(x => x.id === rowId)) {
            this.financialReport.forEach(function (item) {
              if (item.id === rowId) item.variance = value
            });
          }
          break;
        case "reason_for_variance":
          if (this.financialReport.some(x => x.id === rowId)) {
            this.financialReport.forEach(function (item) {
              if (item.id === rowId) item.reason_for_variance = value
            });
          }
          break;
      }
  }

  cellEditor(row, td_id, key: string, oldValue) {
    new CellEdit().edit(row.id, td_id, '', oldValue, key, this.saveCellValue);
  }

}
