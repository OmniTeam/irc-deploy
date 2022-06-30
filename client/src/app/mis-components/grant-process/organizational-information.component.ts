import {Component, Input, OnInit} from '@angular/core';
import {FileUploadService} from "../../services/file-upload.service";
import {GrantProcessService} from "../../services/grant-process.service";

@Component({
  selector: 'organizational-information',
  templateUrl: './organizational-information.component.html',
  styleUrls: ['./grant-process.component.css']
})
export class OrganizationalInformationComponent implements OnInit {

  @Input() grantId: string;
  organisationalInfo: any;
  organisationsInvolved: any;
  openLetterPopup: boolean;
  openInstructionsPopup: boolean;

  items = [
    {name: 'Yes', value: 'Yes'},
    {name: 'No', value: 'No'}
  ];
  decision = [
    {name: 'Proceed with application', value: 'Yes'},
    {name: 'Unsuccessful', value: 'No'}
  ];
  hasApplicationBeenReviewed: any;
  dateOfDueDiligence: any;
  attachmentDiligenceReport: any;
  reviewerComments: any;
  decisionOfReviewProcess: any;
  hasDueDiligenceConducted: any;

  constructor(private grantProcessService: GrantProcessService, public fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {
    //set organizational Info
    this.grantProcessService.getLetterOfInterest(this.grantId).subscribe((results: any) => {
      if (results !== null && results !== undefined) {
        this.organisationalInfo = JSON.parse(results.organisation);
        this.organisationsInvolved = JSON.parse(results.ngos);
      }
    });

    this.grantProcessService.getLetterOfInterestReview(this.grantId).subscribe((data:any) => {
      if (data !== null && data !== undefined) {
        this.hasApplicationBeenReviewed = data.hasBeenReviewed;
        this.dateOfDueDiligence = data.dateOfDueDiligence;
        this.attachmentDiligenceReport = data.dueDiligenceReport;
        this.reviewerComments = data.comments;
        this.decisionOfReviewProcess = data.decision;
        this.hasDueDiligenceConducted = data.dueDiligence;
      }
    });
  }

  openLetterPopUp() {
    this.openLetterPopup = !this.openLetterPopup;
  }

  openInstructionsPopUp() {
    this.openInstructionsPopup = !this.openInstructionsPopup;
  }
}
