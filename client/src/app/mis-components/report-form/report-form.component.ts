import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subject} from "rxjs";
import {ReportFormService} from "../../services/report-form.service";
import {CommentNode, CommentsComponent} from '../comments/comments.component';
import {CellEdit, OnUpdateCell} from '../../utilities/cell_edit';
import {FileUploadService} from '../../services/file-upload.service';
import {v4 as uuid} from 'uuid';
import {AuthService} from "../../services/auth.service";
import {TaskListService} from "../../services/task-list.service";
import {HttpParams} from "@angular/common/http";
import {DummyData} from "../../utilities/dummy-data";

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})

export class ReportFormComponent implements OnInit, OnUpdateCell {

  @ViewChild(CellEdit) cellEdit;

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  comments: Array<CommentNode> = [];
  errorMessage: boolean;
  successMessage: boolean;
  isSubmitVisible: boolean;
  isReviewVisible: boolean;
  isApproveVisible: boolean;
  openCommentsPopup: boolean;
  openRecommendationsPopup: boolean;
  openPopup: boolean;
  loading: boolean = false;
  report: any;

  radioExpensesRealistic:string;
  radioAttachmentsVerified:string;
  radioFiguresRealistic:string;
  radioNarrativeAlign:string;
  radioInlineWithTargets:string;
  radioEvidenceSatisfactory:string;
  reviewerComments: string;
  reviewerRecommendations: string;

  radioSuggestedChangesSatisfactory:string;
  radioReportsWellAligned:string;
  radioRecommendFund:string;
  radioEndOfPartnership:string;
  amountOfFundsDisbursed: string;
  provideAnyRecommendations: string;

  taskId: string;
  taskRecord: any;
  reportValues: [];

  shortLink1: string = "";
  shortLink2: string = "";
  shortLink3: string = "";
  attachment1: string;
  attachment2: string;
  attachment3: string;

  organisationalInfo: any;
  projectInfo: any;
  performanceReport = [];
  financialReport = [];
  listOfRecommendations = [];
  listOfComments = [];
  items = [
    {name: 'Yes', value: 'yes'},
    {name: 'No', value: 'no'}
  ];

  constructor(private router: Router, private route: ActivatedRoute, private formViewService: ReportFormService, private taskListService: TaskListService, private fileUploadService: FileUploadService, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.organisationalInfo = DummyData.organisationalInfo;
    this.projectInfo = DummyData.projectInfo;
    this.listOfComments = DummyData.listOfComments;
    this.listOfRecommendations = DummyData.listOfRecommendations;

    this.route.params
      .subscribe(p => {
        this.taskId = p['id'];
        const params = new HttpParams().set('id', this.taskId);
        this.taskListService.getTaskRecord(params).subscribe((data) => {
          this.taskRecord = data;
        }, error => console.log(error));
      });

    const params = new HttpParams()
      .set('taskId', this.taskId);

    this.formViewService.getAttachmentsForTask(params).subscribe(data => {
      if(data.files!=null){
        data.files.forEach((file)=>{
          if(file.name==="attachment1"){this.attachment1 = file.path; this.shortLink1 = file.path;}
          if(file.name==="attachment2"){this.attachment2 = file.path; this.shortLink2 = file.path;}
          if(file.name==="attachment3"){this.attachment3 = file.path; this.shortLink3 = file.path;}
        });
      }
    }, error => console.log("Error getting attachments",error));

    this.listOfComments.forEach((commentNode) => {
      this.comments.push(new CommentNode(commentNode.id, commentNode.text, commentNode.user, commentNode.likes, this.getAnswersToComments(commentNode.answers), new Date(commentNode.datetimeCreated)));
    });

    this.formViewService.getReportForTask(params).subscribe(data => {
      if(data.report!=null) {
        this.report = data.report;
        let reports = JSON.parse(data.report.reportValues);
        console.log("reports", reports);
        this.financialReport = JSON.parse(reports.financialReport);
        this.performanceReport = JSON.parse(reports.performanceReport);
      } else {
        this.financialReport = DummyData.financialReport;
        this.performanceReport = DummyData.performanceReport;
      }

      this.isSubmitVisible = true;
      this.isReviewVisible = false;
      this.isApproveVisible = false;
      this.dtTrigger.next();
    }, error => console.log("Error getting task",error));

    this.dtOptions = {
      pagingType: "numbers",
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
      processing: true,
      responsive: true,
      dom: 'lfBrtip',
      buttons: []
    };
  }

  getAnswersToComments(list) {
    let answers = [];
    list.forEach((answer) => {
      answers.push(new CommentNode(answer.id, answer.text, answer.user, answer.likes, this.getAnswersToComments(answer.answers), new Date(answer.datetimeCreated)));
    });
    return answers;
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

          console.log("shortlink",this.shortLink1);

          this.loading = false; // Flag variable
        }
      }
    );
  }

  changeForm(formName) {
    this.isSubmitVisible = false;
    this.isReviewVisible = false;
    this.isApproveVisible = false;
    if (formName == 'Submit') this.isSubmitVisible = true;
    if (formName == 'Review') this.isReviewVisible = true;
    if (formName == 'Approve') this.isApproveVisible = true;
    window.scroll(0, 0);
    this.successMessage = false;
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

  saveReport(reportValues: { [key: string]: string }) {
    let reportRecord: { [key: string]: string } = {
      taskId: this.taskRecord.id,
      processId: this.taskRecord.processInstanceId,
      userId: this.authService.getLoggedInUsername(),
      groupId: this.taskRecord.groupId,
      taskDefinitionKey: this.taskRecord.taskDefinitionKey,
      reportValues: JSON.stringify(reportValues),
      status: 'In Progress'
    }
    if (this.report) {
      this.formViewService.updateReport(reportRecord, this.report.id).subscribe((data) => {
        this.errorMessage = false;
        this.successMessage = true;
      }, error => {
        this.errorMessage = true;
        this.successMessage = false;
        console.log(error);
      });
    } else {
      this.formViewService.createReport(reportRecord).subscribe((data) => {
        this.errorMessage = false;
        this.successMessage = true;
      }, error => {
        this.errorMessage = true;
        this.successMessage = false;
        console.log(error);
      });
    }
  }

  submitReport() {
    this.errorMessage = false;
    this.successMessage = false;

    let reportValues: { [key: string]: string } = {
      financialReport: JSON.stringify(this.financialReport),
      performanceReport: JSON.stringify(this.performanceReport),
    }

    this.saveReport(reportValues);

    let attachments = [];
    attachments.push({key: 'attachment1', value:this.attachment1});
    attachments.push({key: 'attachment2', value:this.attachment2});
    attachments.push({key: 'attachment3', value:this.attachment3});

    attachments.forEach((attachment) => {
      if(attachment!=null) {
        let fileRecord: { [key: string]: string } = {
          taskId: this.taskRecord.id,
          processId: this.taskRecord.processInstanceId,
          userId: this.authService.getLoggedInUsername(),
          groupId: this.taskRecord.groupId,
          taskDefinitionKey: this.taskRecord.taskDefinitionKey,
          path: attachment.value,
          name: attachment.key,
        }

        const params = new HttpParams().set('taskId', this.taskId).set('name', attachment.key);
        this.formViewService.getFileByTaskAndName(params).subscribe((data) => {
          let record = data.fileRecord;
          if(record==null) {
            this.formViewService.saveFile(fileRecord).subscribe((data) => {
              console.log('saved file successfully')
            }, error => console.log('file', error));
          } else {
            console.log('record', record);
            this.formViewService.updateFile(fileRecord, record.id).subscribe((data) => {
              console.log('updated file successfully')
            }, error => console.log('file', error));
          }
          console.log('file', record);
        }, error => console.log(error));

      }
    });

    this.changeForm('Review');
  }

  reviewReport() {
    this.errorMessage = false;
    this.successMessage = false;

    let reportValues: { [key: string]: string } = {
      financialReport: JSON.stringify(this.financialReport),
      performanceReport: JSON.stringify(this.performanceReport),
      reviewerInformation: JSON.stringify({
        expenses_realistic: this.radioExpensesRealistic,
        attachments_verified: this.radioAttachmentsVerified,
        figures_realistic: this.radioFiguresRealistic,
        narrative_align: this.radioNarrativeAlign,
        inline_with_targets: this.radioInlineWithTargets,
        evidence_satisfactory: this.radioEvidenceSatisfactory,
        comments: this.reviewerComments,
        recommendations: this.reviewerRecommendations
      })
    }

    this.saveReport(reportValues);

    this.changeForm('Approve');
  }

  approveReport() {
    this.listOfComments.forEach((comment) => {
      let commentsRecord: { [key: string]: string } = {
        taskId: this.taskRecord.id,
        processId: this.taskRecord.processInstanceId,
        userId: comment.user,
        groupId: this.taskRecord.groupId,
        taskDefinitionKey: this.taskRecord.taskDefinitionKey,
        content: comment.text,
        children: JSON.stringify(comment.answers),
      }
    });

    this.listOfRecommendations.forEach((recommendation) => {
      let recommendationsRecord: { [key: string]: string } = {
        taskId: this.taskRecord.id,
        processId: this.taskRecord.processInstanceId,
        userId: recommendation.user,
        groupId: this.taskRecord.groupId,
        taskDefinitionKey: this.taskRecord.taskDefinitionKey,
        content: recommendation.text,
      }
    });

    let reportValues: { [key: string]: string } = {
      financialReport: JSON.stringify(this.financialReport),
      performanceReport: JSON.stringify(this.performanceReport),
      approverInformation: JSON.stringify({
        suggested_changes_satisfactory: this.radioSuggestedChangesSatisfactory,
        reports_well_aligned: this.radioReportsWellAligned,
        recommend_fund: this.radioRecommendFund,
        end_of_partnership: this.radioEndOfPartnership,
        amountOfFundsDisbursed: this.amountOfFundsDisbursed,
        provideAnyRecommendations: this.provideAnyRecommendations
      })
    }

    this.saveReport(reportValues);
  }

}
