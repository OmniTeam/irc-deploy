import {Component, OnInit} from '@angular/core';
import {CommentNode} from "../comments/comments.component";
import {AuthService} from "../../services/auth.service";
import {v4 as uuid} from 'uuid';
import {GrantProcessService} from "../../services/grant-process.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskListService} from "../../services/task-list.service";
import {HttpParams} from "@angular/common/http";
import {FileUploadService} from "../../services/file-upload.service";
import {AlertService} from "../../services/alert";

@Component({
  selector: 'app-grant-process',
  templateUrl: './grant-process.component.html',
  styleUrls: ['./grant-process.component.css']
})
export class GrantProcessComponent implements OnInit {
  isSubmitLetterOfInterest: boolean;
  isReviewLetterOfInterest: boolean;
  isPlanningLearningApplication: boolean;
  isReviewPlanningLearningGrant: boolean;
  isApprovePlanningLearningGrant: boolean;
  isProvidePlanningLearningGrant: boolean;
  isSubmitReport: boolean;
  isReviewReport: boolean;

  taskRecord: any;

  loading: boolean;
  isReadOnly: boolean;
  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;

  hasApplicationBeenReviewed: any;
  dateOfDueDiligence: any;
  attachmentDiligenceReport: any;
  reviewerComments: any;
  decisionOfReviewProcess: any;
  hasDueDiligenceConducted: any;

  items = [
    {name: 'Yes', value: 'Yes'},
    {name: 'No', value: 'No'}
  ];
  decision = [
    {name: 'Proceed with application', value: 'Yes'},
    {name: 'Unsuccessful', value: 'No'}
  ];
  decision2 = [
    {name: 'Proceed with application', value: 'Yes'},
    {name: 'Return to Program Officer for further Review', value: 'No'}
  ];
  decision3 = [
    {name: 'Apply for long term grant', value: 'Yes'},
    {name: 'Do not apply for long term grant', value: 'No'}
  ];
  isConceptInline: any;
  doesItAdhere: any;
  areTheyAdhering: any;
  achieveIntendedObjectives: any;
  adhereToBudget: any;
  activitiesInlineWithWorkPlan: any;
  grantId: string;
  definitionKey: string;
  processInstanceId: string;
  decisionOfApproveProcess: any;
  approveComments: any;

  comments: Array<CommentNode> = [];
  openCommentsPopup: boolean;
  openPopup: boolean;
  financeSectionComments: any;
  leadAgency: any;
  grantAmount: any;
  periodFrom: any;
  periodTo: any;
  clusterName: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private grantProcessService: GrantProcessService,
    private taskListService: TaskListService,
    public fileUploadService: FileUploadService,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.isSubmitLetterOfInterest = false;
    this.isReviewLetterOfInterest = false;
    this.isPlanningLearningApplication = false
    this.isReviewPlanningLearningGrant = false;
    this.isApprovePlanningLearningGrant = false;
    this.isProvidePlanningLearningGrant = false;
    this.isSubmitReport = false;
    this.isReviewReport = false;

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
          this.isSubmitLetterOfInterest = true
        }
      });
  }

  setData(data) {
    this.taskRecord = data
    if (data.taskDefinitionKey === "Review_and_Conduct_Due_Diligence") {
      this.isReviewLetterOfInterest = true;
      this.grantProcessService.getLetterOfInterestReview(data.grantId).subscribe((data: any) => {
        console.log('review record available', data)
        this.hasApplicationBeenReviewed = data.hasBeenReviewed
        this.hasDueDiligenceConducted = data.dueDiligence
        this.decisionOfReviewProcess = data.decision
        this.dateOfDueDiligence = data.dateOfDueDiligence
        this.attachmentDiligenceReport = data.dueDiligenceReport
        this.reviewerComments = data.comments
      })
    }
    if (data.taskDefinitionKey === "Apply_for_Learning_Planning_Grant") {
      this.isPlanningLearningApplication = true;
      this.grantProcessService.getPlanningAndLearningRecord(data.grantId).subscribe((data) => {
        console.log('apply PandG record available', data)
      })
    }
    if (data.taskDefinitionKey === "Review_Concept") {
      this.isReviewPlanningLearningGrant = true;
      this.grantProcessService.getPlanningAndLearningReview(data.grantId).subscribe((data: any) => {
        console.log('apply PlanningAndLearningReview record available', data)
        this.isConceptInline = data.isConceptInline
        this.doesItAdhere = data.doesItAdhere
        this.decisionOfReviewProcess = data.decision
        this.areTheyAdhering = data.areTheyAdhering
        this.reviewerComments = data.comments
      })
    }
    if (data.taskDefinitionKey === "Approve_Learning_Grant") {
      this.isApprovePlanningLearningGrant = true;
      this.grantProcessService.getPlanningAndLearningApprove(data.grantId).subscribe((data: any) => {
        console.log('apply PlanningAndLearningApprove record available', data)
        this.decisionOfApproveProcess = data.decision
        this.approveComments = data.comments
      })
    }
    if (data.taskDefinitionKey === "Provide_Learning_Grant") {
      this.isProvidePlanningLearningGrant = true;
      this.grantProcessService.getProvideLearningGrant(data.grantId).subscribe((data) => {
        console.log('apply ProvideLearningGrant record available', data)
      })
    }
    if (data.taskDefinitionKey === "Submit_Report") {
      this.isSubmitReport = true;
      this.grantProcessService.getGrantReport(data.grantId).subscribe((data) => {
        console.log('apply GrantReport record available', data)
      })
    }
    if (data.taskDefinitionKey === "Review_Report" || data.taskDefinitionKey === "Archive_Report") {
      this.isReviewReport = true;
      this.grantProcessService.getGrantReportReview(data.grantId).subscribe((data: any) => {
        this.activitiesInlineWithWorkPlan = data.activitiesInlineWithWorkPlan;
        this.adhereToBudget = data.adhereToBudget;
        this.achieveIntendedObjectives = data.achieveIntendedObjectives;
        this.decisionOfReviewProcess = data.decision;
        this.reviewerComments = data.comments;
      })
    }
    this.grantId = data.grantId;
    this.definitionKey = data.taskDefinitionKey
    this.processInstanceId = data.processInstanceId
  }

  getAllComments() {
    this.loading = true;
    this.comments = []
    this.grantProcessService.getLetterOfInterestReview(this.grantId).subscribe((data: any) => {
      this.comments.push(new CommentNode(data.id, data.comments, data.user, [], [], data.dateCreated));
      this.loading = false;
    }, error => {
      this.loading = false;
    })
    this.grantProcessService.getPlanningAndLearningReview(this.grantId).subscribe((data: any) => {
      this.comments.push(new CommentNode(data.id, data.comments, data.user, [], [], data.dateCreated));
      this.loading = false;
    }, error => {
      this.loading = false;
    })
    this.grantProcessService.getPlanningAndLearningApprove(this.grantId).subscribe((data: any) => {
      this.comments.push(new CommentNode(data.id, data.comments, data.user, [], [], data.dateCreated));
      this.loading = false;
    }, error => {
      this.loading = false;
    })
    this.grantProcessService.getProvideLearningGrant(this.grantId).subscribe((data: any) => {
      this.comments.push(new CommentNode(data.id, data.comments, data.user, [], [], data.dateCreated));
      this.loading = false;
    }, error => {
      this.loading = false;
    })
    this.grantProcessService.getGrantReportReview(this.grantId).subscribe((data: any) => {
      this.comments.push(new CommentNode(data.id, data.comments, data.user, [], [], data.dateCreated));
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }

  handleFileInput(event) {
    let files: FileList = event.target.files;
    this.uploadFile(files.item(0), event.target.id);
  }

  uploadFile(file, id) {
    this.loading = !this.loading;
    this.fileUploadService.upload(file, 'PandL_Grant').subscribe((data) => {
      if (id === "attachmentDiligenceReport") this.attachmentDiligenceReport = data.path;
      this.loading = false;
    }, error => {
      console.log(error)
    });
  }

  viewComments(): void {
    this.getAllComments()
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

  onNewCommentHandler(comment: CommentNode) {
    console.log("New comment", comment);
    this.reviewerComments = comment.text
    this.approveComments = comment.text
    this.financeSectionComments = comment.text
  }

  statusChangedHandler(status: string) {
    console.log('status', status);
    this.taskRecord.status = status
    this.taskListService.updateTask(this.taskRecord, this.taskRecord.id).subscribe((data) => {
      console.log('successfully Submitted task');
    }, error => console.log('submit task', error));
  }

  submit(key, status) {
    switch (key) {
      case 'reviewLetter':
        this.submitReviewLetterOfInterest(status)
        break
      case 'reviewConcept':
        this.planningAndLearningReview(status)
        break
      case 'approveConcept':
        this.planningAndLearningApprove(status)
        break
      case 'provideLearningGrant':
        this.provideLearningGrant(status)
        break
      case 'reviewReport':
        this.submitGrantReportReview(status)
        break
    }

    setTimeout(() => {
      if (status != "draft" && this.success) this.router.navigate(['/home']);
      this.success = false;
      this.error = false;
    }, 3000);
  }

  submitReviewLetterOfInterest(status) {
    if (this.decisionOfReviewProcess != undefined) {
      let formData: { [key: string]: string } = {
        grantId: this.grantId,
        definitionKey: this.definitionKey,
        processInstanceId: this.processInstanceId,
        hasBeenReviewed: this.hasApplicationBeenReviewed,
        dueDiligence: this.hasDueDiligenceConducted,
        dateOfDueDiligence: this.dateOfDueDiligence,
        dueDiligenceReport: this.attachmentDiligenceReport,
        comments: this.reviewerComments,
        decision: this.decisionOfReviewProcess,
        user: this.authService.getLoggedInUsername(),
        status: status
      }

      let apiUrl = `${this.grantProcessService.reviewLetterOfInterest}/getByProcessInstanceId`
      const params = new HttpParams().set('id', formData.processInstanceId);
      this.grantProcessService.getRecordByProcessInstanceId(apiUrl, params).subscribe((response: any) => {
        if (response?.results != null) {
          this.grantProcessService.updateLetterOfInterestReview(formData, response.results.id).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Updated";
            this.taskRecord.outputVariables = '{"reviewSuccessful": "' + this.decisionOfReviewProcess + '"}'
            this.statusChangedHandler(status)
            this.alertService.success(this.successMessage);
            this.router.navigate(['/home']);
          }, error => {
            this.error = true;
            this.errorMessage = "Failed to update";
            this.alertService.error(this.errorMessage);
            this.success = false;
            console.log(error);
          });
        } else {
          this.grantProcessService.createReviewLetterOfInterest(formData).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Submitted";
            this.taskRecord.outputVariables = '{"reviewSuccessful": "' + this.decisionOfReviewProcess + '"}'
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

  planningAndLearningReview(status) {
    if (this.decisionOfReviewProcess != undefined) {
      let formData: { [key: string]: string } = {
        grantId: this.grantId,
        definitionKey: this.definitionKey,
        processInstanceId: this.processInstanceId,
        isConceptInline: this.isConceptInline,
        doesItAdhere: this.doesItAdhere,
        areTheyAdhering: this.areTheyAdhering,
        comments: this.reviewerComments,
        decision: this.decisionOfReviewProcess,
        user: this.authService.getLoggedInUsername(),
        status: status
      }
      let apiUrl = `${this.grantProcessService.planningLearningReview}/getByProcessInstanceId`
      const params = new HttpParams().set('id', formData.processInstanceId);
      this.grantProcessService.getRecordByProcessInstanceId(apiUrl, params).subscribe((response: any) => {
        if (response?.results != null) {
          this.grantProcessService.updatePlanningAndLearningReview(formData, response.results.id).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Updated";
            this.taskRecord.outputVariables = '{"reviewConcept": "' + this.decisionOfReviewProcess + '"}'
            this.statusChangedHandler(status)
            this.alertService.success(this.successMessage);
            this.router.navigate(['/home']);
          }, error => {
            this.error = true;
            this.errorMessage = "Failed to update";
            this.alertService.error(this.errorMessage);
            this.success = false;
            console.log(error);
          });
        } else {
          this.grantProcessService.createPlanningAndLearningReview(formData).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Submitted";
            this.taskRecord.outputVariables = '{"reviewConcept": "' + this.decisionOfReviewProcess + '"}'
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

  planningAndLearningApprove(status) {
    if (this.decisionOfApproveProcess != undefined) {
      let formData: { [key: string]: string } = {
        grantId: this.grantId,
        definitionKey: this.definitionKey,
        processInstanceId: this.processInstanceId,
        comments: this.approveComments,
        decision: this.decisionOfApproveProcess,
        user: this.authService.getLoggedInUsername(),
        status: status
      }

      let apiUrl = `${this.grantProcessService.planningLearningApprove}/getByProcessInstanceId`
      const params = new HttpParams().set('id', formData.processInstanceId);
      this.grantProcessService.getRecordByProcessInstanceId(apiUrl, params).subscribe((response: any) => {
        if (response?.results != null) {
          this.grantProcessService.updatePlanningAndLearningApprove(formData, response.results.id).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Updated";
            this.taskRecord.outputVariables = '{"approveGrant": "' + this.decisionOfApproveProcess + '"}'
            this.statusChangedHandler(status)
            this.alertService.success(this.successMessage);
            this.router.navigate(['/home']);
          }, error => {
            this.error = true;
            this.errorMessage = "Failed to update";
            this.alertService.error(this.errorMessage);
            this.success = false;
            console.log(error);
          });
        } else {
          this.grantProcessService.createPlanningAndLearningApprove(formData).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Submitted";
            this.taskRecord.outputVariables = '{"approveGrant": "' + this.decisionOfApproveProcess + '"}'
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

  provideLearningGrant(status) {
    let formData: { [key: string]: string } = {
      grantId: this.grantId,
      definitionKey: this.definitionKey,
      processInstanceId: this.processInstanceId,
      clusterName: this.clusterName,
      dateFrom: this.periodFrom,
      dateTo: this.periodTo,
      leadAgency: this.leadAgency,
      grantAmount: this.grantAmount,
      comments: this.financeSectionComments,
      user: this.authService.getLoggedInUsername(),
      status: status
    }

    let apiUrl = `${this.grantProcessService.provideLearningGrant}/getByProcessInstanceId`
    const params = new HttpParams().set('id', formData.processInstanceId);
    this.grantProcessService.getRecordByProcessInstanceId(apiUrl, params).subscribe((response: any) => {
      if (response?.results != null) {
        this.grantProcessService.updateProvideLearningGrant(formData, response.results.id).subscribe((data) => {
          console.log('response', data)
          this.error = false;
          this.success = true;
          this.successMessage = "Updated";
          this.statusChangedHandler(status)
          this.alertService.success(this.successMessage);
          this.router.navigate(['/home']);
        }, error => {
          this.error = true;
          this.errorMessage = "Failed to update";
          this.alertService.error(this.errorMessage);
          this.success = false;
          console.log(error);
        });
      } else {
        this.grantProcessService.createProvideLearningGrant(formData).subscribe((data) => {
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

  submitGrantReportReview(status) {
    if (this.decisionOfReviewProcess != undefined) {
      let formData: { [key: string]: string } = {
        grantId: this.grantId,
        definitionKey: this.definitionKey,
        processInstanceId: this.processInstanceId,
        achieveIntendedObjectives: this.achieveIntendedObjectives,
        adhereToBudget: this.adhereToBudget,
        activitiesInlineWithWorkPlan: this.activitiesInlineWithWorkPlan,
        comments: this.reviewerComments,
        decision: this.decisionOfReviewProcess,
        user: this.authService.getLoggedInUsername(),
        status: status
      }

      let apiUrl = `${this.grantProcessService.grantReportReview}/getByProcessInstanceId`
      const params = new HttpParams().set('id', formData.processInstanceId);
      this.grantProcessService.getRecordByProcessInstanceId(apiUrl, params).subscribe((response: any) => {
        if (response?.results != null) {
          this.grantProcessService.updateGrantReportReview(formData, response.results.id).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Updated";
            this.taskRecord.outputVariables = '{"longTermgrant": "' + this.decisionOfReviewProcess + '"}'
            this.statusChangedHandler(status)
            this.alertService.success(this.successMessage);
            this.router.navigate(['/home']);
          }, error => {
            this.error = true;
            this.errorMessage = "Failed to update";
            this.alertService.error(this.errorMessage);
            this.success = false;
            console.log(error);
          });
        } else {
          this.grantProcessService.createGrantReportReview(formData).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Submitted";
            this.taskRecord.outputVariables = '{"longTermgrant": "' + this.decisionOfReviewProcess + '"}'
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

  printPage() {
    window.print();
  }

  cancel() {
    this.router.navigate(['/home']);
  }

}
