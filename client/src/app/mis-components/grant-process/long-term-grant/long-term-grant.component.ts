import {Component, OnInit} from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskListService} from "../../../services/task-list.service";
import {AlertService} from "../../../services/alert";
import {TempDataService} from "../../../services/temp-data.service";
import {LongTermGrantService} from "../../../services/long-term-grant-service";
import {CommentNode} from "../../comments/comments.component";
import {v4 as uuid} from 'uuid';
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-long-term-grant',
  templateUrl: './long-term-grant.component.html',
  styleUrls: ['../grant-process.component.css']
})
export class LongTermGrantComponent implements OnInit {
  isApplication: boolean;
  isReviewApplication: boolean;
  isMakeCorrectionsApplication: boolean;
  isReviewRevisedApplication: boolean;
  isMakeRevisionsEdApplication: boolean;
  isApproveApplication: boolean;
  isSignAgreement: boolean;

  taskRecord: any;
  grantId: string;
  applicationId: string;
  definitionKey: string;
  processInstanceId: string;

  isReadOnly: boolean;
  reviewerComments: any;
  items = [
    {name: 'Yes', value: 'Yes'},
    {name: 'No', value: 'No'}
  ];
  decisionReviewApplication = [
    {name: 'Proceed with application', value: 'proceed'},
    {name: 'Ask for changes in Application', value: 'changes'},
    {name: 'Reject Application', value: 'reject'}
  ];
  decisionReviewRevisedApplication = [
    {name: 'Proceed with application', value: 'proceed'},
    {name: 'Reject Application', value: 'reject'}
  ];
  decisionMakeRevisions = [
    {name: 'Proceed with application', value: 'submit'},
    {name: 'Reject Application', value: 'reject'}
  ];
  decisionApproveApplication = [
    {name: 'Proceed with application', value: 'approve'},
    {name: 'Ask for corrections', value: 'corrections'}
  ];
  success: boolean;
  error: boolean;
  successMessage: string;
  errorMessage: string;
  decisionOfReviewProcess: any;
  areTheyAdhering: any;
  doesItAdhere: any;
  isConceptInline: any;
  approverComments: any;
  signAgreementComments: any;
  dateAgreement: any;
  loading: boolean;
  comments: Array<CommentNode> = [];
  recommendations: Array<CommentNode> = [];
  openCommentsPopup = false;
  openRecommendationsPopup = false;
  openPopup = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskListService: TaskListService,
    private alertService: AlertService,
    private tempDataService: TempDataService,
    public authService: AuthService,
    private longTermGrantService: LongTermGrantService,
  ) {
  }

  ngOnInit(): void {
    this.isApplication = false;
    this.isReviewApplication = false;

    this.route.params
      .subscribe(p => {
        this.isReadOnly = p['readonly'] == 'true';

        if (p['id'] != undefined) {
          const params = new HttpParams().set('id', p['id']);
          this.taskListService.getTaskRecord(params).subscribe((data) => {
            this.setData(data)
          }, (error) => {
            this.taskListService.getArchivedRecord(params).subscribe((data) => {
              console.log(data);
              this.setData(data);
            }, error => console.log(error));
          });
        } else {
          this.isApplication = true
        }
      });
  }

  statusChangedHandler(status: string) {
    console.log('status', status);
    this.taskRecord.status = status
    this.taskListService.updateTask(this.taskRecord, this.taskRecord.id).subscribe((data) => {
      console.log('successfully updated task success');
    }, error => console.log(error));
  }

  variablesChangedHandler(value: string) {
    if (this.isMakeRevisionsEdApplication) {
      this.taskRecord.outputVariables = '{"MakeRevisions": "' + value + '"}'
      this.taskListService.updateTask(this.taskRecord, this.taskRecord.id).subscribe((data) => {
        console.log('successfully updated task variables');
      }, error => console.log(error));
    }
  }

  setData(data) {
    this.taskRecord = data
    if (data.taskDefinitionKey === "Submit_Long_Term_Grant") {
      this.isApplication = true;
    }
    if (data.taskDefinitionKey === "Review_Long-term_Grant_Application") {
      this.isReviewApplication = true;
      this.tempDataService.getTempRecordByValue(data.processInstanceId).subscribe((data: any) => {
        console.log('review record available', data)
        data.forEach((it) => {
          if (it.type == "reviewApplication") {
            let results = JSON.parse(it.json_value)
            this.isConceptInline = results.isConceptInline
            this.doesItAdhere = results.doesItAdhere
            this.decisionOfReviewProcess = results.decision
            this.areTheyAdhering = results.areTheyAdhering
            this.reviewerComments = results.comments
          }
        })
      })
    }
    if (data.taskDefinitionKey === "Make_Revisions_On_Application") {
      this.isMakeCorrectionsApplication = true;
    }
    if (data.taskDefinitionKey === "Review_Revised_Application") {
      this.isReviewRevisedApplication = true;
      this.tempDataService.getTempRecordByValue(data.processInstanceId).subscribe((data: any) => {
        console.log('review record available', data)
        data.forEach((it) => {
          if (it.type == "reviewRevisedApplication") {
            let results = JSON.parse(it.json_value)
            this.decisionOfReviewProcess = results.decision
            this.reviewerComments = results.comments
          }
        })
      })
    }
    if (data.taskDefinitionKey === "Make_Revisions_From_ED") {
      this.isMakeRevisionsEdApplication = true;
    }
    if (data.taskDefinitionKey === "Approve_Application") {
      this.isApproveApplication = true;
      this.tempDataService.getTempRecordByValue(data.processInstanceId).subscribe((data: any) => {
        console.log('review record available', data)
        data.forEach((it) => {
          if (it.type == "approveApplication") {
            let results = JSON.parse(it.json_value)
            this.decisionOfReviewProcess = results.decision
            this.approverComments = results.comments
          }
        })
      })
    }
    if (data.taskDefinitionKey === "Sign_Agreement") {
      this.isSignAgreement = true;
      this.tempDataService.getTempRecordByValue(data.processInstanceId).subscribe((data: any) => {
        console.log('sign record available', data)
        data.forEach((it) => {
          if (it.type == "signAgreement") {
            let results = JSON.parse(it.json_value)
            this.decisionOfReviewProcess = results.decision
            this.signAgreementComments = results.comments
            this.dateAgreement = results.dateAgreement
          }
        })
      })
    }

    this.applicationId = data.id;
    this.grantId = data.grantId;
    this.definitionKey = data.taskDefinitionKey
    this.processInstanceId = data.processInstanceId
  }

  getAllComments() {
    this.loading = true;
    this.comments = []
    this.tempDataService.getTempRecordByValue(this.grantId).subscribe((results: any) => {
      results.forEach(it => {
        let data: any
        if (it.json_value != undefined) {
          data = JSON.parse(it.json_value)
          if (data.comments != "" && data.comments != undefined) this.comments.push(new CommentNode(data.grantId, data.comments, data.user, [], [], null));
        }
      });
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }

  getAllRecommendations() {
    this.loading = true;
    this.recommendations = []
    this.tempDataService.getTempRecordByValue(this.grantId).subscribe((results: any) => {
      results.forEach(it => {
        let data: any
        if (it.json_value != undefined) {
          data = JSON.parse(it.json_value)
          if (data.recommendations != "" && data.recommendations != undefined) this.recommendations.push(new CommentNode(data.grantId, data.recommendations, null, [], [], null));
        }
      });
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }

  viewComments(): void {
    this.getAllComments()
    this.openCommentsPopup = !this.openCommentsPopup;
    this.openPopup = this.openCommentsPopup;
  }

  viewRecommendations(): void {
    this.getAllRecommendations()
    this.openRecommendationsPopup = !this.openRecommendationsPopup;
    this.openPopup = this.openRecommendationsPopup;
  }

  addComment() {
    let text = (document.getElementById("addComment") as HTMLTextAreaElement);
    if (text.value !== "") {
      this.comments.push(new CommentNode(uuid(), text.value, this.authService.getLoggedInUsername(), [], [], new Date()));
      text.value = "";
    }
  }

  addRecommendation() {
    let text = (document.getElementById("addRecommendation") as HTMLTextAreaElement);
    if (text.value !== "") {
      this.recommendations.push(new CommentNode(uuid(), text.value, this.authService.getLoggedInUsername(), [], [], new Date()));
      text.value = "";
    }
  }

  onNewCommentHandler(comment: CommentNode) {
    console.log("New comment", comment);
    this.reviewerComments = comment.text
    this.approverComments = comment.text
    this.signAgreementComments = comment.text
  }

  onNewRecommendationsHandler(comment: CommentNode) {
    console.log("New recommendation", comment);
  }

  submit(key, status) {
    switch (key) {
      case 'reviewApplication':
        this.submitReviewApplication(status)
        break
      case 'reviewRevisedApplication':
        this.submitReviewRevisedApplication(status)
        break
      case 'approveApplication':
        this.approveApplication(status)
        break
      case 'signAgreement':
        this.signAgreement(status)
        break
    }

    setTimeout(() => {
      if (status != "draft" && this.success) this.router.navigate(['/home']);
      this.success = false;
      this.error = false;
    }, 3000);
  }

  submitReviewApplication(status) {
    if (this.decisionOfReviewProcess != undefined &&
      this.isConceptInline != undefined &&
      this.doesItAdhere != undefined &&
      this.areTheyAdhering != undefined &&
      this.reviewerComments != undefined) {
      let formData: { [key: string]: string } = {
        grantId: this.grantId,
        definitionKey: this.definitionKey,
        processInstanceId: this.processInstanceId,
        isConceptInline: this.isConceptInline,
        doesItAdhere: this.doesItAdhere,
        areTheyAdhering: this.areTheyAdhering,
        decision: this.decisionOfReviewProcess,
        comments: this.reviewerComments,
        status: status
      }

      let formDataR: { [key: string]: string } = {
        type: "reviewApplication",
        jsonValue: JSON.stringify(formData),
      }

      //let apiUrl = `${this.longTermGrantService.reviewApplication}/getByProcessInstanceId`
      //const params = new HttpParams().set('id', formData.processInstanceId);
      this.tempDataService.getTempRecordByValue(formData.processInstanceId).subscribe((response: any) => {
        if (response.some(x => x.type === 'reviewApplication')) {
          response.forEach(it => {
            if (it.type === 'reviewApplication') {
              this.tempDataService.updateTempData(formDataR, it.id).subscribe((data) => {
                console.log('response', data)
                this.error = false;
                this.success = true;
                this.successMessage = "Success";
                this.taskRecord.outputVariables = '{"ReviewLongTerm": "' + this.decisionOfReviewProcess + '"}'
                this.statusChangedHandler(status)
                this.alertService.success(this.successMessage);
                this.router.navigate(['/home']);
              }, error => {
                this.error = true;
                this.errorMessage = "Failed to submit";
                this.alertService.error(this.errorMessage);
                this.success = false;
                console.log(error);
              });
            }
          })
        } else {
          this.tempDataService.createTempData(formDataR).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Submitted";
            this.taskRecord.outputVariables = '{"ReviewLongTerm": "' + this.decisionOfReviewProcess + '"}'
            this.statusChangedHandler(status)
            this.alertService.success(this.successMessage);
            this.router.navigate(['/home']);
          }, error => {
            this.error = true;
            this.errorMessage = "Failed to submit";
            this.alertService.error(this.errorMessage);
            this.success = false;
            console.log(error);
          });
        }
      });
    } else {
      this.alertService.error('Please fill in all required details');
      return;
    }
  }

  submitReviewRevisedApplication(status) {
    if (this.decisionOfReviewProcess != undefined) {
      let formData: { [key: string]: string } = {
        grantId: this.grantId,
        definitionKey: this.definitionKey,
        processInstanceId: this.processInstanceId,
        decision: this.decisionOfReviewProcess,
        comments: this.reviewerComments,
        status: status
      }

      let formDataR: { [key: string]: string } = {
        type: "reviewRevisedApplication",
        jsonValue: JSON.stringify(formData),
      }

      //let apiUrl = `${this.longTermGrantService.reviewApplication}/getByProcessInstanceId`
      //const params = new HttpParams().set('id', formData.processInstanceId);
      this.tempDataService.getTempRecordByValue(formData.processInstanceId).subscribe((response: any) => {
        if (response.some(x => x.type === 'reviewRevisedApplication')) {
          response.forEach(it => {
            if (it.type === 'reviewRevisedApplication') {
              this.tempDataService.updateTempData(formDataR, it.id).subscribe((data) => {
                console.log('response', data)
                this.error = false;
                this.success = true;
                this.successMessage = "Success";
                this.taskRecord.outputVariables = '{"ReviewApplication": "' + this.decisionOfReviewProcess + '"}'
                this.statusChangedHandler(status)
                this.alertService.success(this.successMessage);
                this.router.navigate(['/home']);
              }, error => {
                this.error = true;
                this.errorMessage = "Failed to submitted";
                this.alertService.error(this.errorMessage);
                this.success = false;
                console.log(error);
              });
            }
          })
        } else {
          this.tempDataService.createTempData(formDataR).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Submitted";
            this.taskRecord.outputVariables = '{"ReviewApplication": "' + this.decisionOfReviewProcess + '"}'
            this.statusChangedHandler(status)
            this.alertService.success(this.successMessage);
            this.router.navigate(['/home']);
          }, error => {
            this.error = true;
            this.errorMessage = "Failed to submit";
            this.alertService.error(this.errorMessage);
            this.success = false;
            console.log(error);
          });
        }
      });
    } else {
      this.alertService.error('Please fill in all required details');
      return;
    }
  }

  approveApplication(status) {
    if (this.decisionOfReviewProcess != undefined && this.approverComments != undefined) {
      let formData: { [key: string]: string } = {
        grantId: this.grantId,
        definitionKey: this.definitionKey,
        processInstanceId: this.processInstanceId,
        decision: this.decisionOfReviewProcess,
        comments: this.approverComments,
        status: status
      }

      let formDataR: { [key: string]: string } = {
        type: "approveApplication",
        jsonValue: JSON.stringify(formData),
      }

      //let apiUrl = `${this.longTermGrantService.reviewApplication}/getByProcessInstanceId`
      //const params = new HttpParams().set('id', formData.processInstanceId);
      this.tempDataService.getTempRecordByValue(formData.processInstanceId).subscribe((response: any) => {
        if (response.some(x => x.type === 'approveApplication')) {
          response.forEach(it => {
            if (it.type === 'approveApplication') {
              this.tempDataService.updateTempData(formDataR, it.id).subscribe((data) => {
                console.log('response', data)
                this.error = false;
                this.success = true;
                this.successMessage = "Success";
                this.taskRecord.outputVariables = '{"Approve": "' + this.decisionOfReviewProcess + '"}'
                this.statusChangedHandler(status)
                this.alertService.success(this.successMessage);
                this.router.navigate(['/home']);
              }, error => {
                this.error = true;
                this.errorMessage = "Failed to submit";
                this.alertService.error(this.errorMessage);
                this.success = false;
                console.log(error);
              });
            }
          })
        } else {
          this.tempDataService.createTempData(formDataR).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Submitted";
            this.taskRecord.outputVariables = '{"Approve": "' + this.decisionOfReviewProcess + '"}'
            this.statusChangedHandler(status)
            this.alertService.success(this.successMessage);
            this.router.navigate(['/home']);
          }, error => {
            this.error = true;
            this.errorMessage = "Failed to submit";
            this.alertService.error(this.errorMessage);
            this.success = false;
            console.log(error);
          });
        }
      });
    } else {
      this.alertService.error('Please fill in all required details');
      return;
    }
  }

  signAgreement(status) {
    if (this.decisionOfReviewProcess == undefined || this.signAgreementComments == undefined) {
      this.alertService.error('Please fill in all required details');
      return;
    }
    if (this.decisionOfReviewProcess == 'Yes' && this.dateAgreement == undefined) {
      this.alertService.error('Please fill in Date when the agreement was signed');
      return;
    }

    let formData: { [key: string]: string } = {
      grantId: this.grantId,
      definitionKey: this.definitionKey,
      processInstanceId: this.processInstanceId,
      decision: this.decisionOfReviewProcess,
      dateAgreement: this.dateAgreement,
      comments: this.signAgreementComments,
      status: status
    }

    let formDataR: { [key: string]: string } = {
      type: "signAgreement",
      jsonValue: JSON.stringify(formData),
    }

    //let apiUrl = `${this.longTermGrantService.reviewApplication}/getByProcessInstanceId`
    //const params = new HttpParams().set('id', formData.processInstanceId);
    this.tempDataService.getTempRecordByValue(formData.processInstanceId).subscribe((response: any) => {
      if (response.some(x => x.type === 'signAgreement')) {
        response.forEach(it => {
          if (it.type === 'signAgreement') {
            this.tempDataService.updateTempData(formDataR, it.id).subscribe((data) => {
              console.log('response', data)
              this.error = false;
              this.success = true;
              this.successMessage = "Success";
              this.statusChangedHandler(status)
              this.alertService.success(this.successMessage);
              this.router.navigate(['/home']);
            }, error => {
              this.error = true;
              this.errorMessage = "Failed to submit";
              this.alertService.error(this.errorMessage);
              this.success = false;
              console.log(error);
            });
          }
        })
      } else {
        this.tempDataService.createTempData(formDataR).subscribe((data) => {
          console.log('response', data)
          this.error = false;
          this.success = true;
          this.successMessage = "Submitted";
          this.statusChangedHandler(status)
          this.alertService.success(this.successMessage);
          this.router.navigate(['/home']);
        }, error => {
          this.error = true;
          this.errorMessage = "Failed to submit";
          this.alertService.error(this.errorMessage);
          this.success = false;
          console.log(error);
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
