import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountriesService} from "../../services/countries.service";
import {SampleData} from "../../helpers/sample-data";
import {FileUploadService} from "../../services/file-upload.service";

@Component({
  selector: 'planning-learning-application',
  templateUrl: './planning-learning-grant.component.html',
  styleUrls: ['./grant-process.component.css']
})

export class PlanningLearningGrantComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @Output() readOnlyChanged: EventEmitter<boolean> = new EventEmitter();

  formGroup: FormGroup;
  submitted = false;
  countries: any;
  pCountries: any;
  cities: any;
  pCities: any;
  planningAndLearningGrantApplication: any;
  loading: boolean;

  constructor(
    private countriesService: CountriesService,
    private formBuilder: FormBuilder,
    public fileUploadService: FileUploadService
  ) {
  }

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    //this.readOnlyChanged.emit(false);
    this.countries = this.countriesService.getListOfCountries();

    this.planningAndLearningGrantApplication = SampleData.planningAndLearningGrantApplication;

    if (this.planningAndLearningGrantApplication != null && this.isReadOnly) {
      this.formGroup = this.formBuilder.group(this.planningAndLearningGrantApplication)
    } else {
      this.formGroup = this.formBuilder.group({
        proposed_duration: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        proposed_start_date: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        amount_requested: [{value: '', disabled: this.isReadOnly}],
        other_sources: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        total_budget_amt: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        address_contact_person: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        email_contact_person: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        contact_person_number: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        name_authorized_signatory: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        contact_authorized_signatory: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        bank_details: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        other_organization: [{value: '', disabled: this.isReadOnly}, [Validators.required]],

        completed: [{value: '', disabled: this.isReadOnly}],
        mel_framework: [{value: '', disabled: this.isReadOnly}],
        financial: [{value: '', disabled: this.isReadOnly}],
        registration: [{value: '', disabled: this.isReadOnly}],
        list_members: [{value: '', disabled: this.isReadOnly}],
        assessment_report: [{value: '', disabled: this.isReadOnly}],
        strategic_plan: [{value: '', disabled: this.isReadOnly}],
        annual_work_plan: [{value: '', disabled: this.isReadOnly}],
        child_policy: [{value: '', disabled: this.isReadOnly}],
        structure: [{value: '', disabled: this.isReadOnly}],
      });
    }
  }

  submitLetter() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const formData = this.formGroup.value;
    console.log('formData', formData)
  }

  handleFileInput(event) {
    let files: FileList = event.target.files;
    this.uploadFile(files.item(0), event.target.id);
  }

  uploadFile(file, id) {
    this.loading = !this.loading;
    this.fileUploadService.upload(file, 'PandL_Grant').subscribe((data) => {
      if (id === "completed") this.formGroup.patchValue({completed: data.path});
      if (id === "mel_framework") this.formGroup.patchValue({mel_framework: data.path});
      if (id === "financial") this.formGroup.patchValue({financial: data.path});
      if (id === "registration") this.formGroup.patchValue({registration: data.path});
      if (id === "list_members") this.formGroup.patchValue({list_members: data.path});
      if (id === "assessment_report") this.formGroup.patchValue({assessment_report: data.path});
      if (id === "strategic_plan") this.formGroup.patchValue({strategic_plan: data.path});
      if (id === "annual_work_plan") this.formGroup.patchValue({annual_work_plan: data.path});
      if (id === "child_policy") this.formGroup.patchValue({child_policy: data.path});
      if (id === "structure") this.formGroup.patchValue({structure: data.path});
      this.loading = false;
    }, error => {console.log(error)});
  }

  cancel() {
    this.formGroup.reset()
    this.submitted = false
  }
}
