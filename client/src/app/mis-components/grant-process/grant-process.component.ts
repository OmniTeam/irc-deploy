import {Component, OnInit} from '@angular/core';
import {CommentNode} from "../comments/comments.component";
import {AuthService} from "../../services/auth.service";
import {v4 as uuid} from 'uuid';
import {GrantProcessService} from "../../services/grant-process.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskListService} from "../../services/task-list.service";
import {HttpParams} from "@angular/common/http";
import {FileUploadService} from "../../services/file-upload.service";

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

  isReadOnly: boolean;

  hasApplicationBeenReviewed: any;
  dateOfDueDiligence: any;
  attachmentDiligenceReport: any;
  reviewerComments: any;

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
  isConceptInline: any;
  doesItAdhere: any;
  areTheyAdhering: any;
  decisionOfReviewProcess: any;
  hasDueDiligenceConducted: any;
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
    public fileUploadService: FileUploadService
  ) {
  }

  ngOnInit(): void {
    this.isSubmitLetterOfInterest = false;
    this.isReviewLetterOfInterest = false;
    this.isPlanningLearningApplication = false
    this.isReviewPlanningLearningGrant = false;
    this.isApprovePlanningLearningGrant = false;
    this.isProvidePlanningLearningGrant = false;

    this.route.params
      .subscribe(p => {
        this.isReadOnly = p['readonly'] == 'true';

        const params = new HttpParams().set('id', p['id']);
        this.taskListService.getTaskRecord(params).subscribe((data) => {
          if (data.taskDefinitionKey === "Review_and_Conduct_Due_Diligence") this.isReviewLetterOfInterest = true;

          console.log('taskRecord',data)
          this.grantId = data.grantId;
          this.definitionKey = data.taskDefinitionKey
          this.processInstanceId = data.processInstanceId
        })
      });
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

  commentsChangedHandler(comments: Array<CommentNode>) {
    this.comments = comments;
    console.log(comments);
  }

}
