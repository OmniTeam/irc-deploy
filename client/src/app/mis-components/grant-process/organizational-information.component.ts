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

  constructor(private grantProcessService: GrantProcessService, public fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {
    //set organizational Info
    this.grantProcessService.getLetterOfInterest(this.grantId).subscribe((results: any) => {
      if (results !== null && results !== undefined) {
        this.organisationalInfo = results;
      }
    });
  }

}
