import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountriesService} from "../../services/countries.service";
import {SampleData} from "../../helpers/sample-data";
import {FileUploadService} from "../../services/file-upload.service";
import {GrantProcessService} from "../../services/grant-process.service";

@Component({
  selector: 'planning-learning-application',
  templateUrl: './planning-learning-grant.component.html',
  styleUrls: ['./grant-process.component.css']
})

export class PlanningLearningGrantComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @Input() grantId: string;
  @Output() readOnlyChanged: EventEmitter<boolean> = new EventEmitter();

  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;

  formGroup: FormGroup;
  submitted = false;
  countries: any;
  pCountries: any;
  cities: any;
  pCities: any;
  loading: boolean;

  constructor(
    private countriesService: CountriesService,
    private formBuilder: FormBuilder,
    public fileUploadService: FileUploadService,
    private grantProcessService: GrantProcessService
  ) {
  }

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.countries = this.countriesService.getListOfCountries();

    this.grantProcessService.getPlanningAndLearningRecord(this.grantId).subscribe((data: any) => {
      if (data != null && this.isReadOnly) {
        this.formGroup = this.formBuilder.group({
          proposedDuration: [{value: data.proposedDuration, disabled: this.isReadOnly}, [Validators.required]],
          proposedStartDate: [{value: data.proposedStartDate, disabled: this.isReadOnly}, [Validators.required]],
          amountRequested: [{value: data.amountRequested, disabled: this.isReadOnly}],
          otherSources: [{value: data.otherSources, disabled: this.isReadOnly}, [Validators.required]],
          totalBudgetAmt: [{value: data.totalBudgetAmt, disabled: this.isReadOnly}, [Validators.required]],
          addressContactPerson: [{value: data.addressContactPerson, disabled: this.isReadOnly}, [Validators.required]],
          emailContactPerson: [{value: data.emailContactPerson, disabled: this.isReadOnly}, [Validators.required]],
          contactPersonNumber: [{value: data.contactPersonNumber, disabled: this.isReadOnly}, [Validators.required]],
          nameAuthorizedSignatory: [{value: data.nameAuthorizedSignatory, disabled: this.isReadOnly}, [Validators.required]],
          contactAuthorizedSignatory: [{value: data.contactAuthorizedSignatory, disabled: this.isReadOnly}, [Validators.required]],
          bankDetails: [{value: data.bankDetails, disabled: this.isReadOnly}, [Validators.required]],
          otherOrganization: [{value: data.otherOrganization, disabled: this.isReadOnly}, [Validators.required]],

          completedAttachment: [{value: data.completedAttachment, disabled: this.isReadOnly}],
          melFrameworkAttachment: [{value: data.melFrameworkAttachment, disabled: this.isReadOnly}],
          financialAttachment: [{value: data.financialAttachment, disabled: this.isReadOnly}],
          registration: [{value: data.registration, disabled: this.isReadOnly}],
          listMembersAttachment: [{value: data.listMembersAttachment, disabled: this.isReadOnly}],
          assessmentReport: [{value: data.assessmentReport, disabled: this.isReadOnly}],
          strategicPlan: [{value: data.strategicPlan, disabled: this.isReadOnly}],
          annualWorkPlan: [{value: data.annualWorkPlan, disabled: this.isReadOnly}],
          childPolicy: [{value: data.childPolicy, disabled: this.isReadOnly}],
          structure: [{value: data.structure, disabled: this.isReadOnly}],
        });
      } else this.setEmptyForm()
    }, error => {
      console.log(error)
      this.setEmptyForm()
    })
  }

  setEmptyForm() {
    this.formGroup = this.formBuilder.group({
      proposedDuration: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      proposedStartDate: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      amountRequested: [{value: '', disabled: this.isReadOnly}],
      otherSources: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      totalBudgetAmt: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      addressContactPerson: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      emailContactPerson: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      contactPersonNumber: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      nameAuthorizedSignatory: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      contactAuthorizedSignatory: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      bankDetails: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      otherOrganization: [{value: '', disabled: this.isReadOnly}, [Validators.required]],

      completedAttachment: [{value: '', disabled: this.isReadOnly}],
      melFrameworkAttachment: [{value: '', disabled: this.isReadOnly}],
      financialAttachment: [{value: '', disabled: this.isReadOnly}],
      registration: [{value: '', disabled: this.isReadOnly}],
      listMembersAttachment: [{value: '', disabled: this.isReadOnly}],
      assessmentReport: [{value: '', disabled: this.isReadOnly}],
      strategicPlan: [{value: '', disabled: this.isReadOnly}],
      annualWorkPlan: [{value: '', disabled: this.isReadOnly}],
      childPolicy: [{value: '', disabled: this.isReadOnly}],
      structure: [{value: '', disabled: this.isReadOnly}],
    });
  }

  submitLetter() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const formData = this.formGroup.value;
    console.log('formData', formData)

    this.grantProcessService.createPlanningAndLearningRecord(formData).subscribe(data => {
      console.log(data)
      this.submitted = true
      this.error = false;
      this.success = true;
      this.successMessage = "Saved Application";
    }, error => {
      this.error = true;
      this.errorMessage = "Failed to save Application";
      this.success = false;
      console.log(error);
    });
    setTimeout(() => {
      this.formGroup.reset()
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
    }, error => {
      console.log(error)
    });
  }

  cancel() {
    this.formGroup.reset()
    this.submitted = false
  }
}
