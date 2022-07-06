import {Component, OnInit} from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskListService} from "../../../services/task-list.service";
import {AlertService} from "../../../services/alert";
import {LongTermGrantService} from "../../../services/long-term-grant.service";
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
  submitted: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskListService: TaskListService,
    private alertService: AlertService,
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
          this.taskListService.getTaskRecord(params).subscribe((task) => {
            this.setData(task)
          }, (error) => {
            this.taskListService.getArchivedRecord(params).subscribe((task) => {
              console.log(task);
              this.setData(task);
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

  setData(task) {
    this.taskRecord = task
    this.longTermGrantService.getReviewApplicationByGrantId(task.grantId).subscribe((application: any) => {
      this.applicationId = application.id;
    })
    if (task.taskDefinitionKey === "Submit_Long_Term_Grant") {
      this.isApplication = true;
    }
    if (task.taskDefinitionKey === "Review_Long-term_Grant_Application") {
      this.isReviewApplication = true;
      this.longTermGrantService.getReviewApplicationByGrantId(task.grantId).subscribe((data: any) => {
        data.record.forEach((it) => {
          if (it.type == "reviewApplication") {
            console.log('review record available', data)
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
    if (task.taskDefinitionKey === "Make_Revisions_On_Application") {
      this.isMakeCorrectionsApplication = true;
    }
    if (task.taskDefinitionKey === "Review_Revised_Application") {
      this.isReviewRevisedApplication = true;
      this.longTermGrantService.getReviewApplicationByGrantId(task.grantId).subscribe((data: any) => {
        data.record.forEach((it) => {
          if (it.type == "reviewRevisedApplication") {
            console.log('review record available', data)
            let results = JSON.parse(it.json_value)
            this.decisionOfReviewProcess = results.decision
            this.reviewerComments = results.comments
          }
        })
      })
    }
    if (task.taskDefinitionKey === "Make_Revisions_From_ED") {
      this.isMakeRevisionsEdApplication = true;
    }
    if (task.taskDefinitionKey === "Approve_Application") {
      this.isApproveApplication = true;
      this.longTermGrantService.getReviewApplicationByGrantId(task.grantId).subscribe((data: any) => {
        data.record.forEach((it) => {
          if (it.type == "approveApplication") {
            console.log('review record available', data)
            let results = JSON.parse(it.json_value)
            this.decisionOfReviewProcess = results.decision
            this.approverComments = results.comments
          }
        })
      })
    }
    if (task.taskDefinitionKey === "Sign_Agreement") {
      this.isSignAgreement = true;
      this.longTermGrantService.getReviewApplicationByGrantId(task.grantId).subscribe((data: any) => {
        data.record.forEach((it) => {
          if (it.type == "signAgreement") {
            console.log('sign record available', data)
            let results = JSON.parse(it.json_value)
            this.decisionOfReviewProcess = results.decision
            this.signAgreementComments = results.comments
            this.dateAgreement = results.dateAgreement
          }
        })
      })
    }

    this.grantId = task.grantId;
    this.definitionKey = task.taskDefinitionKey
    this.processInstanceId = task.processInstanceId
  }

  getAllComments() {
    this.loading = true;
    this.comments = []
    this.longTermGrantService.getReviewApplicationByGrantId(this.grantId).subscribe((data: any) => {
      data.record.forEach(results => {
        if (results != undefined) {
          if (results.comments != "" && results.comments != undefined) this.comments.push(new CommentNode(results.grantId, results.comments, results.user, [], [], null));
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
    this.longTermGrantService.getReviewApplicationByGrantId(this.grantId).subscribe((data: any) => {
      data.record.forEach(results => {
        if (results != undefined) {
          if (results.recommendations != "" && results.recommendations != undefined) this.recommendations.push(new CommentNode(results.grantId, results.recommendations, null, [], [], null));
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
    this.submitted = true
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
        applicationId: this.applicationId,
        user: this.authService.getLoggedInUsername(),
        definitionKey: this.definitionKey,
        processInstanceId: this.processInstanceId,
        isConceptInline: this.isConceptInline,
        doesItAdhere: this.doesItAdhere,
        areTheyAdhering: this.areTheyAdhering,
        decision: this.decisionOfReviewProcess,
        comments: this.reviewerComments,
        type: "reviewApplication",
        status: status
      }

      this.longTermGrantService.getReviewApplicationByGrantId(formData.grantId).subscribe((response: any) => {
        response.record.forEach(it => {
          if (it.type === 'reviewApplication') {
            this.longTermGrantService.updateReviewApplication(formData, it.id).subscribe((data) => {
              console.log('response', data)
              this.error = false;
              this.success = true;
              this.successMessage = "Success";
              this.taskRecord.outputVariables = '{"ReviewLongTerm": "' + this.decisionOfReviewProcess + '"}'
              this.statusChangedHandler(status)
              this.alertService.success(this.successMessage);
              this.router.navigate(['/home']);
            }, error => {
              this.submitted = false
              this.error = true;
              this.errorMessage = "Failed to submit";
              this.alertService.error(this.errorMessage);
              this.success = false;
              console.log(error);
            });
          }
        })
      }, error => {
        this.longTermGrantService.createReviewApplication(formData).subscribe((data) => {
          console.log('response', data)
          this.error = false;
          this.success = true;
          this.successMessage = "Submitted";
          this.taskRecord.outputVariables = '{"ReviewLongTerm": "' + this.decisionOfReviewProcess + '"}'
          this.statusChangedHandler(status)
          this.alertService.success(this.successMessage);
          this.router.navigate(['/home']);
        }, error => {
          this.submitted = false
          this.error = true;
          this.errorMessage = "Failed to submit";
          this.alertService.error(this.errorMessage);
          this.success = false;
          console.log(error);
        });
      });
    } else {
      this.submitted = false
      this.alertService.error('Please fill in all required details');
      return;
    }
  }

  submitReviewRevisedApplication(status) {
    if (this.decisionReviewRevisedApplication != undefined &&
      this.reviewerComments != undefined) {
      let formData: { [key: string]: string } = {
        grantId: this.grantId,
        applicationId: this.applicationId,
        user: this.authService.getLoggedInUsername(),
        definitionKey: this.definitionKey,
        processInstanceId: this.processInstanceId,
        decision: this.decisionOfReviewProcess,
        comments: this.reviewerComments,
        type: "reviewRevisedApplication",
        status: status
      }

      this.longTermGrantService.getReviewApplicationByGrantId(formData.grantId).subscribe((response: any) => {
        response.recordforEach(it => {
          if (it.type === 'reviewRevisedApplication') {
            this.longTermGrantService.updateReviewApplication(formData, it.id).subscribe((data) => {
              console.log('response', data)
              this.error = false;
              this.success = true;
              this.successMessage = "Success";
              this.taskRecord.outputVariables = '{"ReviewApplication": "' + this.decisionOfReviewProcess + '"}'
              this.statusChangedHandler(status)
              this.alertService.success(this.successMessage);
              this.router.navigate(['/home']);
            }, error => {
              this.submitted = false
              this.error = true;
              this.errorMessage = "Failed to submitted";
              this.alertService.error(this.errorMessage);
              this.success = false;
              console.log(error);
            });
          }
        })
      }, error => {
        this.longTermGrantService.createReviewApplication(formData).subscribe((data) => {
          console.log('response', data)
          this.error = false;
          this.success = true;
          this.successMessage = "Submitted";
          this.taskRecord.outputVariables = '{"ReviewApplication": "' + this.decisionOfReviewProcess + '"}'
          this.statusChangedHandler(status)
          this.alertService.success(this.successMessage);
          this.router.navigate(['/home']);
        }, error => {
          this.submitted = false
          this.error = true;
          this.errorMessage = "Failed to submit";
          this.alertService.error(this.errorMessage);
          this.success = false;
          console.log(error);
        });
      });
    } else {
      this.submitted = false
      this.alertService.error('Please fill in all required details');
      return;
    }
  }

  approveApplication(status) {
    if (this.decisionOfReviewProcess != undefined && this.approverComments != undefined) {
      let formData: { [key: string]: string } = {
        grantId: this.grantId,
        applicationId: this.applicationId,
        user: this.authService.getLoggedInUsername(),
        definitionKey: this.definitionKey,
        processInstanceId: this.processInstanceId,
        decision: this.decisionOfReviewProcess,
        comments: this.approverComments,
        type: "approveApplication",
        status: status
      }

      this.longTermGrantService.getReviewApplicationByGrantId(formData.grantId).subscribe((response: any) => {
        response.recordforEach(it => {
          if (it.type === 'approveApplication') {
            this.longTermGrantService.updateReviewApplication(formData, it.id).subscribe((data) => {
              console.log('response', data)
              this.error = false;
              this.success = true;
              this.successMessage = "Success";
              this.taskRecord.outputVariables = '{"Approve": "' + this.decisionOfReviewProcess + '"}'
              this.statusChangedHandler(status)
              this.alertService.success(this.successMessage);
              this.router.navigate(['/home']);
            }, error => {
              this.submitted = false
              this.error = true;
              this.errorMessage = "Failed to submit";
              this.alertService.error(this.errorMessage);
              this.success = false;
              console.log(error);
            });
          }
        })
      }, error => {
        this.longTermGrantService.createReviewApplication(formData).subscribe((data) => {
          console.log('response', data)
          this.error = false;
          this.success = true;
          this.successMessage = "Submitted";
          this.taskRecord.outputVariables = '{"Approve": "' + this.decisionOfReviewProcess + '"}'
          this.statusChangedHandler(status)
          this.alertService.success(this.successMessage);
          this.router.navigate(['/home']);
        }, error => {
          this.submitted = false
          this.error = true;
          this.errorMessage = "Failed to submit";
          this.alertService.error(this.errorMessage);
          this.success = false;
          console.log(error);
        });
      });
    } else {
      this.submitted = false
      this.alertService.error('Please fill in all required details');
      return;
    }
  }

  signAgreement(status) {
    if (this.decisionOfReviewProcess == undefined || this.signAgreementComments == undefined) {
      this.submitted = false
      this.alertService.error('Please fill in all required details');
      return;
    }
    if (this.decisionOfReviewProcess == 'Yes' && this.dateAgreement == undefined) {
      this.submitted = false
      this.alertService.error('Please fill in Date when the agreement was signed');
      return;
    }

    let formData: { [key: string]: string } = {
      grantId: this.grantId,
      applicationId: this.applicationId,
      user: this.authService.getLoggedInUsername(),
      definitionKey: this.definitionKey,
      processInstanceId: this.processInstanceId,
      decision: this.decisionOfReviewProcess,
      dateAgreement: this.dateAgreement,
      comments: this.signAgreementComments,
      type: "signAgreement",
      status: status
    }

    this.longTermGrantService.getReviewApplicationByGrantId(formData.grantId).subscribe((response: any) => {
      response.recordforEach(it => {
        if (it.type === 'signAgreement') {
          this.longTermGrantService.updateReviewApplication(formData, it.id).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Success";
            this.statusChangedHandler(status)
            this.alertService.success(this.successMessage);
            this.router.navigate(['/home']);
          }, error => {
            this.submitted = false
            this.error = true;
            this.errorMessage = "Failed to submit";
            this.alertService.error(this.errorMessage);
            this.success = false;
            console.log(error);
          });
        }
      })
    }, error => {
      this.longTermGrantService.createReviewApplication(formData).subscribe((data) => {
        console.log('response', data)
        this.error = false;
        this.success = true;
        this.successMessage = "Submitted";
        this.statusChangedHandler(status)
        this.alertService.success(this.successMessage);
        this.router.navigate(['/home']);
      }, error => {
        this.submitted = false
        this.error = true;
        this.errorMessage = "Failed to submit";
        this.alertService.error(this.errorMessage);
        this.success = false;
        console.log(error);
      });
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
