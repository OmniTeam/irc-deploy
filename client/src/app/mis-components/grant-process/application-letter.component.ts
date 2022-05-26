import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CountriesService} from "../../services/countries.service";
import {FileUploadService} from "../../services/file-upload.service";
import {GrantProcessService} from "../../services/grant-process.service";
import {Router} from "@angular/router";
import {AlertService} from "../../services/alert";
import {ProgramService} from "../../services/program.service";
import {MessagePagesComponent} from "../message-pages/message-pages.component";

@Component({
  selector: 'application-letter',
  templateUrl: './application-letter.component.html',
  styleUrls: ['./grant-process.component.css']
})

export class ApplicationLetterComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @Input() grantId: string;

  submitted = false;
  loading: boolean;

  status = 'not_started';
  // countries: any;
  // cities: any;
  programs: any;
  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;

  /*values*/
  program: string;

  /*json*/
  organisation: any = {};
  ngos: any = {};
  proposal: any = {};
  financial: any = {};
  documents: any = {};

  constructor(
    private router: Router,
    private countriesService: CountriesService,
    private formBuilder: FormBuilder,
    public fileUploadService: FileUploadService,
    private grantProcessService: GrantProcessService,
    private programService: ProgramService,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    // this.countries = this.countriesService.getListOfCountries();

    this.programService.getPrograms().subscribe((data)=>{
      let results = []
      if(data!=null) {
        data.forEach((it)=>{
          results.push({id: it.id, name: it.title})
        })
      }
      this.programs = results;
    })

    if (this.isReadOnly) {
      this.grantProcessService.getLetterOfInterest(this.grantId).subscribe((data: any) => {
        if (data != null) {
          this.program = data.program
          this.organisation = JSON.parse(data.organisation);
          this.ngos = JSON.parse(data.ngos);
          this.proposal = JSON.parse(data.proposal);
          this.financial = JSON.parse(data.financial);
          this.documents = JSON.parse(data.documents);
        }
      }, error => {
        console.log(error)
      })
    }
  }

  submitLetter() {
    this.submitted = true;

    let formData: { [key: string]: string } = {
      program: this.program,
      organisation: JSON.stringify(this.organisation),
      ngos: JSON.stringify(this.ngos),
      proposal: JSON.stringify(this.proposal),
      financial: JSON.stringify(this.financial),
      documents: JSON.stringify(this.documents),
      status: this.status
    }
    console.log('formData', formData)

    this.grantProcessService.createLetterOfInterest(formData).subscribe(data => {
      console.log(data)
      this.submitted = true
      this.error = false;
      this.success = true;
      this.successMessage = "Application Successfully Submitted";
      this.alertService.success(this.successMessage);
    }, error => {
      this.error = true;
      this.success = false;
      this.errorMessage = "Failed to submit Application";
      this.alertService.error(this.errorMessage);
      console.log(error);
    });
    setTimeout(() => {
      if (this.success == true) {
        this.router.navigate(['/messagePage/success']);
      }
      this.success = false;
      this.error = false;
    }, 3000);
  }

  handleFileInput(event) {
    let files: FileList = event.target.files;
    this.uploadFile(files.item(0), event.target.id);
  }

  uploadFile(file, id) {
    this.loading = !this.loading;
    this.fileUploadService.upload(file, 'PandL_Grant').subscribe((data) => {
      if (id === "financialAttachment") this.documents.financial = data.path;
      if (id === "registration") this.documents.registration = data.path;
      if (id === "listMembersAttachment") this.documents.listMembers = data.path;
      if (id === "listStaffMembersAttachment") this.documents.listStaffMembers = data.path;
      if (id === "organizationStructure") this.documents.organizationStructure = data.path;
      if (id === "assessmentReport") this.documents.assessmentReport = data.path;
      if (id === "strategicPlan") this.documents.strategicPlan = data.path;
      if (id === "annualWorkPlan") this.documents.annualWorkPlan = data.path;
      if (id === "mou") this.documents.mou = data.path;
      if (id === "childPolicy") this.documents.childPolicy = data.path;
      this.loading = false;
    }, error => {
      console.log(error)
    });
  }

  cancel() {
    this.submitted = false
    window.location.reload();
  }
}
