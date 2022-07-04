import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CountriesService} from "../../services/countries.service";
import {FileUploadService} from "../../services/file-upload.service";
import {GrantProcessService} from "../../services/grant-process.service";
import {Router} from "@angular/router";
import {v4 as uuid} from 'uuid';
import {AlertService} from "../../services/alert";
import {ProgramService} from "../../services/program.service";
import {Validator} from "../../helpers/validator";

@Component({
  selector: 'application-letter',
  templateUrl: './application-letter.component.html',
  styleUrls: ['./grant-process.component.css']
})

export class ApplicationLetterComponent implements OnInit {
  @Output() triggerNextProcess: EventEmitter<string> = new EventEmitter();
  @Input() isReadOnly: boolean;
  @Input() grantId: string;
  @Input() isLongTerm: boolean;

  submitted = false;
  loading: boolean;
  inValidNumber: boolean;
  inValidTelephone: boolean;

  status = 'not_started';
  programs: any;
  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;

  /*values*/
  program: string;

  countries: any;
  cities: any;

  /*json*/
  organisation: any = {};
  ngos: any[] = [{
    id: uuid(),
    nameOfPartnerOrganization: "",
    telephoneOfPartnerOrganization: "",
    members: "",
    whyCollaborate: "",
    clusterResponse: ""
  }];
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
    this.countries = this.countriesService.getListOfAvailableCountries();

    this.programService.getPrograms().subscribe((data) => {
      this.programs = data;
    })

    if (this.isReadOnly) {
      this.grantProcessService.getLetterOfInterest(this.grantId).subscribe((data: any) => {
        if (data != null) {
          console.log("data", data)
          this.program = data.program
          this.organisation = JSON.parse(data.organisation);
          this.ngos = JSON.parse(data.ngos);
          this.documents = JSON.parse(data.documents);
          if (data.proposal != undefined) this.proposal = JSON.parse(data.proposal);
          if (data.financial != undefined) this.financial = JSON.parse(data.financial);
        }
      }, error => {
        console.log(error)
      })
    }
  }

  validate = (obj, validations) =>
    validations.every(key => ![undefined, null].includes(key.split('.').reduce((acc, cur) => acc?.[cur], obj)));

  submitLetter() {
    this.submitted = true;
    if (this.organisation.email == null) {
      this.alertService.error("Please fill in the organization email");
      return;
    }
    if (this.program == null) {
      this.alertService.error("Please choose the Program");
      return;
    }
    let orgAllFilled = this.validate(this.organisation, ['name', 'names', 'contact', 'email', 'physicalAddress', 'organizationType', 'nameCluster', 'areaOfOperation', 'country', 'city', 'inspired', 'visionMission', 'structure', 'corePrograms', 'programOnPrevention', 'funding'])
    let ngosAllFilled = this.validate(this.ngos[0], ['nameOfPartnerOrganization', 'telephoneOfPartnerOrganization', 'members', 'whyCollaborate', 'clusterResponse'])
    let proposalAllFilled = this.validate(this.proposal, ['actions', 'geographicAreas', 'strength'])
    let financialAllFilled = this.validate(this.financial, ['fundsAmount', 'budget'])
    let documentsAllFilled = this.validate(this.documents, ['financial', 'registration', 'listMembers', 'listStaffMembers', 'organizationStructure', 'annualWorkPlan'])
    if (!orgAllFilled) {
      this.alertService.error("Please fill in all compulsory fields in Part I");
      return;
    }
    if (!ngosAllFilled) {
      this.alertService.error("Please fill in all compulsory fields in Part II");
      return;
    }
    if (!proposalAllFilled && !this.isLongTerm) {
      this.alertService.error("Please fill in all compulsory fields in Part III");
      return;
    }
    if (!financialAllFilled && !this.isLongTerm) {
      this.alertService.error("Please fill in all compulsory fields in Part IV");
      return;
    }
    if (!documentsAllFilled) {
      this.alertService.error("Please fill in all compulsory fields in Part V");
      return;
    }

    let formData: { [key: string]: string } = this.isLongTerm ?
      {
        program: this.program,
        organisation: JSON.stringify(this.organisation),
        ngos: JSON.stringify(this.ngos),
        documents: JSON.stringify(this.documents),
        status: this.status
      } : {
        program: this.program,
        organisation: JSON.stringify(this.organisation),
        ngos: JSON.stringify(this.ngos),
        proposal: JSON.stringify(this.proposal),
        financial: JSON.stringify(this.financial),
        documents: JSON.stringify(this.documents),
        status: this.status
      }

    this.grantProcessService.createLetterOfInterest(formData).subscribe(data => {
      console.log('response', data)
      this.submitted = true
      this.error = false;
      this.success = true;
      this.successMessage = "Application Successfully Submitted";
      this.alertService.success(this.successMessage);
      this.triggerNextProcess.emit(data.id);
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
      this.submitted = false;
    }, 3000);
  }

  handleFileInput(event) {
    let files: FileList = event.target.files;
    this.uploadFile(files.item(0), event.target.id);
  }

  onSelectCountry(country) {
    this.countriesService.getCitiesForCountry(country).subscribe((response) => {
      this.cities = response.data;
    }, error => console.log(error))
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

  countChars(max, id) {
    (document.getElementById(id) as HTMLTextAreaElement).innerHTML = max
  }

  validateNumber(value) {
    this.inValidNumber = Validator.telephoneNumber(value)
  }

  validateTelephone(value) {
    this.inValidTelephone = Validator.telephoneNumber(value)
  }

  addNgoRecord() {
    this.ngos.push({
      id: uuid(),
      nameOfPartnerOrganization: "",
      telephoneOfPartnerOrganization: "",
      members: "",
      whyCollaborate: "",
      clusterResponse: ""
    })
  }

  removeNgoRecord(ngoId) {
    this.ngos = this.ngos.filter(item => item.id != ngoId);
  }

  cancel() {
    this.submitted = false
    window.location.reload();
  }
}
