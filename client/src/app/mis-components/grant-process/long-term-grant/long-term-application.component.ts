import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountriesService} from "../../../services/countries.service";
import {FileUploadService} from "../../../services/file-upload.service";
import {Validator} from "../../../helpers/validator";
import {TempDataService} from "../../../services/temp-data.service";
import {AlertService} from "../../../services/alert";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'long-term-application',
  templateUrl: './long-term-application.component.html',
  styleUrls: ['../grant-process.component.css']
})

export class LongTermApplicationComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @Input() grantId: string;
  @Input() processInstanceId: string;
  @Input() definitionKey: string;
  @Output() statusChanged: EventEmitter<string> = new EventEmitter();

  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;

  formGroupLT: FormGroup;
  submitted = false;
  loading: boolean;

  countries: any;
  cities: any;
  documents: any = {};
  inValidNumber: boolean;
  status = "completed";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private countriesService: CountriesService,
    private formBuilder: FormBuilder,
    public fileUploadService: FileUploadService,
    private tempDataService: TempDataService,
    private alertService: AlertService
  ) {
  }

  get f() {
    return this.formGroupLT.controls;
  }

  ngOnInit(): void {
    this.countries = this.countriesService.getListOfAvailableCountries();

    if (this.isReadOnly) {
      this.tempDataService.getTempRecordByValue(this.grantId).subscribe((data: any) => {
        if(data!=null) {
          let results: any
          if (data[0].json_value != undefined) {
            results = JSON.parse(data[0].json_value)
            this.documents = JSON.parse(results.documents)
          }
          this.formGroupLT = this.formBuilder.group({
            projectTitle: [{value: results?.projectTitle, disabled: this.isReadOnly}, [Validators.required]],
            projectDuration: [{value: results?.projectDuration, disabled: this.isReadOnly}],
            country: [{value: results?.country, disabled: this.isReadOnly}],
            city: [{value: results?.city, disabled: this.isReadOnly}],
            projectProposed: [{value: results?.projectProposed, disabled: this.isReadOnly}],
            projectAmount: [{value: results?.projectAmount, disabled: this.isReadOnly}],
            amountRequested: [{value: results?.amountRequested, disabled: this.isReadOnly}],
            funding: [{value: results?.funding, disabled: this.isReadOnly}],
            nameAuthorizedSignatory: [{value: results?.nameAuthorizedSignatory, disabled: this.isReadOnly}],
            contactAuthorizedSignatory: [{value: results?.contactAuthorizedSignatory, disabled: this.isReadOnly}],
            bankDetails: [{value: results?.bankDetails, disabled: this.isReadOnly}],

            problemBackground: [{value: results?.problemBackground, disabled: this.isReadOnly}],
            problemAddressed: [{value: results?.problemAddressed, disabled: this.isReadOnly}],
            targetPopulation: [{value: results?.targetPopulation, disabled: this.isReadOnly}],
            reasonForTargetPopulation: [{value: results?.reasonForTargetPopulation, disabled: this.isReadOnly}],
            whatChangeExpected: [{value: results?.whatChangeExpected, disabled: this.isReadOnly}],
            overallGoal: [{value: results?.overallGoal, disabled: this.isReadOnly}],
            midtermChanges: [{value: results?.midtermChanges, disabled: this.isReadOnly}],
            immediateChanges: [{value: results?.immediateChanges, disabled: this.isReadOnly}],
            activities: [{value: results?.activities, disabled: this.isReadOnly}],
            risksAndChallenges: [{value: results?.risksAndChallenges, disabled: this.isReadOnly}],
            partnershipsAndNetworks: [{value: results?.partnershipsAndNetworks, disabled: this.isReadOnly}],
            changeEnvisioned: [{value: results?.changeEnvisioned, disabled: this.isReadOnly}],
            structuresAndPlans: [{value: results?.structuresAndPlans, disabled: this.isReadOnly}],
            totalProjectCost: [{value: results?.totalProjectCost, disabled: this.isReadOnly}],
            documents: [{value: results?.documents, disabled: this.isReadOnly}],

            grantId: [{value: results?.grantId}, [Validators.required]],
            processInstanceId: [{value: results?.processInstanceId}],
            definitionKey: [{value: results?.definitionKey}],
            status: [{value: results?.status}],
          });
        }
      }, error => {
        console.log(error)
      })
    } else {
      this.setEmptyForm()
    }
  }

  setEmptyForm() {
    this.formGroupLT = this.formBuilder.group({
      projectTitle: [null, [Validators.required]],
      projectDuration: [null],
      country: [null],
      city: [null],
      projectProposed: [null],
      projectAmount: [null],
      amountRequested: [null],
      funding: [null],
      nameAuthorizedSignatory: [null],
      contactAuthorizedSignatory: [null],
      bankDetails: [null],

      problemBackground: [null],
      problemAddressed: [null],
      targetPopulation: [null],
      reasonForTargetPopulation: [null],
      whatChangeExpected: [null],
      overallGoal: [null],
      midtermChanges: [null],
      immediateChanges: [null],
      activities: [null],
      risksAndChallenges: [null],
      partnershipsAndNetworks: [null],
      changeEnvisioned: [null],
      structuresAndPlans: [null],
      totalProjectCost: [null],
      documents: [null],

      grantId: [null, [Validators.required]],
      processInstanceId: [null],
      definitionKey: [null],
      status: [null],
    });
  }

  submitLetter() {
    this.submitted = true;
    if (this.formGroupLT.invalid || this.inValidNumber) {
      this.alertService.error("Please fill in all fields correctly");
      return;
    }

    if (this.documents != null) {
      let value = JSON.stringify(this.documents)
      this.formGroupLT.patchValue({documents: value});
    }
    const formData = this.formGroupLT.value;

    let formDataR: { [key: string]: string } = {
      type: "application",
      jsonValue: JSON.stringify(formData),
    }

    this.tempDataService.getTempRecordByValue(this.grantId).subscribe(data => {
      if(data==null || data.length==0) {
         this.tempDataService.createTempData(formDataR).subscribe(res => {
           console.log("response", res)
           this.submitted = true
           this.error = false;
           this.success = true;
           this.successMessage = "Saved Application";
           this.alertService.success(this.successMessage);
           this.statusChanged.emit(this.status);
         }, error => {
           this.error = true;
           this.success = false;
           this.errorMessage = "Failed to save Application";
           this.alertService.error(this.errorMessage);
           console.log(error);
         });
      } else console.log("Record already exists")
    });

    setTimeout(() => {
      if (this.success == true) {
        this.formGroupLT.reset()
        this.router.navigate(['/home']);
      }
      this.success = false;
      this.error = false;
    }, 3000);

  }

  onSelectCountry(country) {
    this.countriesService.getCitiesForCountry(country).subscribe((response) => {
      this.cities = response.data;
    }, error => console.log(error))
  }

  handleFileInput(event) {
    let files: FileList = event.target.files;
    this.uploadFile(files.item(0), event.target.id);
  }

  uploadFile(file, id) {
    this.loading = !this.loading;
    this.fileUploadService.upload(file, 'Longterm_Grant').subscribe((data) => {
      if (id === "detailedBudget") this.documents.detailedBudget = data.path;
      if (id === "workplan") this.documents.workplan = data.path;
      if (id === "framework") this.documents.framework = data.path;
      if (id === "clusterGuideline") this.documents.clusterGuideline = data.path;
      if (id === "staffMembers") this.documents.staffMembers = data.path;
      if (id === "mou") this.documents.mou = data.path;
      this.loading = false;
    }, error => {
      console.log(error)
    });
  }

  validateNumber(value) {
    this.inValidNumber = Validator.telephoneNumber(value)
  }

  cancel() {
    this.formGroupLT.reset()
    this.submitted = false
  }
}
