import {Component, Input, OnInit} from '@angular/core';
import {ProgramPartnersService} from "../../services/program-partners.service";

@Component({
  selector: 'organizational-information',
  templateUrl: './organizational-information.component.html',
  styleUrls: ['./grant-process.component.css']
})
export class OrganizationalInformationComponent implements OnInit {

  @Input() partnerId: string;
  organisationalInfo: any;

  constructor(private programPartnersService: ProgramPartnersService) { }

  ngOnInit(): void {
    //set organizational Info
    this.programPartnersService.getCurrentProgramPartner(this.partnerId).subscribe((results: any) => {
      if (results !== null && results !== undefined) {
        this.organisationalInfo = results;
      }
    });
  }


}
