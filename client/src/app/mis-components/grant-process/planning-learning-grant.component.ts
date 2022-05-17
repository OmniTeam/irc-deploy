import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountriesService} from "../../services/countries.service";
import {SampleData} from "../../helpers/sample-data";
import {FileUploadService} from "../../services/file-upload.service";
import {GrantProcessService} from "../../services/grant-process.service";
import {AlertService} from "../../services/alert";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'planning-learning-application',
  templateUrl: './planning-learning-grant.component.html',
  styleUrls: ['./grant-process.component.css']
})

export class PlanningLearningGrantComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @Input() grantId: string;
  @Input() processInstanceId: string;
  @Input() definitionKey: string;
  @Output() statusChanged: EventEmitter<string> = new EventEmitter();

  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;
  status = 'completed';

  formGp: FormGroup;
  submitted = false;
  countries: any;
  pCountries: any;
  cities: any;
  pCities: any;
  loading: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private countriesService: CountriesService,
    private formBuilder: FormBuilder,
    public fileUploadService: FileUploadService,
    private grantProcessService: GrantProcessService,
    private alertService: AlertService
  ) {
  }

  get f() {
    return this.formGp.controls;
  }

  ngOnInit(): void {
    this.countries = this.countriesService.getListOfCountries();

    if (!this.isReadOnly) {
      this.setEmptyForm()
    } else {
      this.grantProcessService.getPlanningAndLearningRecord(this.grantId).subscribe((data: any) => {
        console.log('getPlanningAndLearningRecord', data)
          this.formGp = this.formBuilder.group({
            proposedDuration: [{value: data?.proposedDuration, disabled: this.isReadOnly}, [Validators.required]],
            proposedStartDate: [{value: data?.proposedStartDate, disabled: this.isReadOnly}, [Validators.required]],
            amountRequested: [{value: data?.amountRequested, disabled: this.isReadOnly}],
            otherSources: [{value: data?.otherSources, disabled: this.isReadOnly}, [Validators.required]],
            totalBudgetAmt: [{value: data?.totalBudgetAmt, disabled: this.isReadOnly}, [Validators.required]],
            addressContactPerson: [{
              value: data?.addressContactPerson,
              disabled: this.isReadOnly
            }, [Validators.required]],
            emailContactPerson: [{value: data?.emailContactPerson, disabled: this.isReadOnly}, [Validators.required]],
            contactPersonNumber: [{value: data?.contactPersonNumber, disabled: this.isReadOnly}, [Validators.required]],
            nameAuthorizedSignatory: [{
              value: data?.nameAuthorizedSignatory,
              disabled: this.isReadOnly
            }, [Validators.required]],
            contactAuthorizedSignatory: [{
              value: data?.contactAuthorizedSignatory,
              disabled: this.isReadOnly
            }, [Validators.required]],
            bankDetails: [{value: data?.bankDetails, disabled: this.isReadOnly}, [Validators.required]],
            otherOrganization: [{value: data?.otherOrganization, disabled: this.isReadOnly}, [Validators.required]],

            completedAttachment: [{value: data?.completedAttachment, disabled: this.isReadOnly}],
            melFrameworkAttachment: [{value: data?.melFrameworkAttachment, disabled: this.isReadOnly}],
            financialAttachment: [{value: data?.financialAttachment, disabled: this.isReadOnly}],
            registration: [{value: data?.registration, disabled: this.isReadOnly}],
            listMembersAttachment: [{value: data?.listMembersAttachment, disabled: this.isReadOnly}],
            assessmentReport: [{value: data?.assessmentReport, disabled: this.isReadOnly}],
            strategicPlan: [{value: data?.strategicPlan, disabled: this.isReadOnly}],
            annualWorkPlan: [{value: data?.annualWorkPlan, disabled: this.isReadOnly}],
            childPolicy: [{value: data?.childPolicy, disabled: this.isReadOnly}],
            structure: [{value: data?.structure, disabled: this.isReadOnly}],
            grantId: [{value: this.grantId, disabled: this.isReadOnly}],
            processInstanceId: [{value: this.processInstanceId, disabled: this.isReadOnly}],
            definitionKey: [{value: this.definitionKey, disabled: this.isReadOnly}],
          });
      }, error=>{console.log(error)})
    }
  }

  setEmptyForm() {
    this.formGp = this.formBuilder.group({
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
      grantId: [{value: '', disabled: this.isReadOnly}],
      processInstanceId: [{value: '', disabled: this.isReadOnly}],
      definitionKey: [{value: '', disabled: this.isReadOnly}],
    });
  }

  submitLetter() {
    this.submitted = true;
    console.log('formData', this.formGp.value)
    if (this.formGp.invalid) {
      this.alertService.error("Please fill in all fields correctly");
      return;
    }
    const formData = this.formGp.value;
    console.log('formData', formData)

    this.grantProcessService.createPlanningAndLearningRecord(formData).subscribe(data => {
      console.log(data)
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
    setTimeout(() => {
      if (this.success == true) {
        this.formGp.reset()
        this.router.navigate(['/taskList']);
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
      if (id === "completed") this.formGp.patchValue({completedAttachment: data.path});
      if (id === "mel_framework") this.formGp.patchValue({melFrameworkAttachment: data.path});
      if (id === "financial") this.formGp.patchValue({financialAttachment: data.path});
      if (id === "registration") this.formGp.patchValue({registration: data.path});
      if (id === "list_members") this.formGp.patchValue({listMembersAttachment: data.path});
      if (id === "assessment_report") this.formGp.patchValue({assessmentReport: data.path});
      if (id === "strategic_plan") this.formGp.patchValue({strategicPlan: data.path});
      if (id === "annual_work_plan") this.formGp.patchValue({annualWorkPlan: data.path});
      if (id === "child_policy") this.formGp.patchValue({childPolicy: data.path});
      if (id === "structure") this.formGp.patchValue({structure: data.path});
      this.loading = false;
    }, error => {
      console.log(error)
    });
  }

  saveDraft(){
    this.status = 'draft'
    this.submitLetter()
  }

  cancel() {
    this.formGp.reset()
    this.submitted = false
  }
}
