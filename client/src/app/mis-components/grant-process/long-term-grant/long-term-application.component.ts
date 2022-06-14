import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountriesService} from "../../../services/countries.service";
import {FileUploadService} from "../../../services/file-upload.service";
import {document} from "ngx-bootstrap/utils";
import {Validator} from "../../../helpers/validator";

@Component({
  selector: 'long-term-application',
  templateUrl: './long-term-application.component.html',
  styleUrls: ['../grant-process.component.css']
})

export class LongTermApplicationComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @Input() grantId: string;

  formGroupLT: FormGroup;
  submitted = false;
  loading: boolean;

  countries: any;
  cities: any;
  documents: any = {};
  inValidNumber: boolean;

  constructor(
    private countriesService: CountriesService,
    private formBuilder: FormBuilder,
    public fileUploadService:FileUploadService
  ) { }

  get f() {
    return this.formGroupLT.controls;
  }

  ngOnInit(): void {
    this.countries = this.countriesService.getListOfAvailableCountries();

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
    });
  }

  submitLetter() {
    this.submitted = true;
    if (this.formGroupLT.invalid) {
      console.log('Invalid');
      return;
    }

    if(this.documents!=null) {
      let value = JSON.stringify(this.documents)
      this.formGroupLT.patchValue({documents: value});
    }
    const formData = this.formGroupLT.value;
    console.log('formData', formData)
  }

  onSelectCountry(country){
    this.countriesService.getCitiesForCountry(country).subscribe((response)=>{
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
