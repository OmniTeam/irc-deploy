import {Component, Input, OnInit} from '@angular/core';
import {ProgramPartnersService} from "../../services/program-partners.service";
import {FileUploadService} from "../../services/file-upload.service";

@Component({
  selector: 'organizational-information',
  templateUrl: './organizational-information.component.html',
  styleUrls: ['./grant-process.component.css']
})
export class OrganizationalInformationComponent implements OnInit {

  @Input() grantId: string;
  organisationalInfo: any;

  constructor(private programPartnersService: ProgramPartnersService, public fileUploadService:FileUploadService) { }

  ngOnInit(): void {
    //set organizational Info
    this.programPartnersService.getCurrentProgramPartner(this.grantId).subscribe((results: any) => {
      if (results !== null && results !== undefined) {
        this.organisationalInfo = results;
      }
    });
  }

}
