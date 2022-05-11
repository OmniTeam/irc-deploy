import {Component, OnInit} from '@angular/core';
import {CommentNode} from "../comments/comments.component";
import {AuthService} from "../../services/auth.service";
import {v4 as uuid} from 'uuid';

@Component({
  selector: 'app-grant-process',
  templateUrl: './grant-process.component.html',
  styleUrls: ['./grant-process.component.css']
})
export class GrantProcessComponent implements OnInit {
  isSubmitLetterOfInterest: boolean;
  isReviewLetterOfInterest: boolean;
  isPlanningLearningApplication: boolean;
  isReviewLearningGrant: boolean;
  isApprovePlanningLearningGrant: boolean;
  isProvidePlanningLearningGrant: boolean;

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
  partnerId: string;
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

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.partnerId = "33547de5-83a7-42d6-9b36-3e7a3b292271"

    this.isSubmitLetterOfInterest = true;
    this.isReviewLetterOfInterest = false;
    this.isPlanningLearningApplication = false;
    this.isReviewLearningGrant = false;
    this.isApprovePlanningLearningGrant = false;
    this.isProvidePlanningLearningGrant = false;
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
