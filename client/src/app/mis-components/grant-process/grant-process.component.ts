import {Component, OnInit} from '@angular/core';

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
  isConceptInline: any;
  doesItAdhere: any;
  areTheyAdhering: any;
  decisionOfReviewProcess: any;

  constructor() { }

  ngOnInit(): void {
    this.isSubmitLetterOfInterest = true;
    this.isReviewLetterOfInterest = false;
    this.isPlanningLearningApplication = false;
    this.isReviewLearningGrant = false;
    this.isApprovePlanningLearningGrant = false;
    this.isProvidePlanningLearningGrant = false;
  }


}
