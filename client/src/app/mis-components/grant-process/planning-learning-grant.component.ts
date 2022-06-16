import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountriesService} from "../../services/countries.service";
import {FileUploadService} from "../../services/file-upload.service";
import {GrantProcessService} from "../../services/grant-process.service";
import {AlertService} from "../../services/alert";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpParams} from "@angular/common/http";
import {Validator} from "../../helpers/validator";

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
  @Input() taskStatus: string;
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
  inValidNumber: boolean;

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
    this.countries = this.countriesService.getListOfAvailableCountries();

    if (this.isReadOnly || this.taskStatus == 'draft') {
      this.grantProcessService.getPlanningAndLearningRecord(this.grantId).subscribe((data: any) => {
        this.formGp = this.formBuilder.group({
          proposedDuration: [{value: data?.proposedDuration, disabled: this.isReadOnly}, [Validators.required]],
          proposedStartDate: [{value: data?.proposedStartDate, disabled: this.isReadOnly}, [Validators.required]],
          amountRequested: [{value: data?.amountRequested, disabled: this.isReadOnly}],
          otherSources: [{value: data?.otherSources, disabled: this.isReadOnly}, [Validators.required]],
          totalBudgetAmt: [{value: data?.totalBudgetAmt, disabled: this.isReadOnly}, [Validators.required]],
          country: [{value: data?.country, disabled: this.isReadOnly}, [Validators.required]],
          city: [{value: data?.city, disabled: this.isReadOnly}, [Validators.required]],
          nameAuthorizedSignatory: [{value: data?.nameAuthorizedSignatory, disabled: this.isReadOnly}, [Validators.required]],
          contactAuthorizedSignatory: [{value: data?.contactAuthorizedSignatory, disabled: this.isReadOnly}, [Validators.required]],
          bankDetails: [{value: data?.bankDetails, disabled: this.isReadOnly}, [Validators.required]],
          sixMonthsManaged: [{value: data?.sixMonthsManaged, disabled: this.isReadOnly}, [Validators.required]],
          activitiesAndStrategies: [{value: data?.activitiesAndStrategies, disabled: this.isReadOnly}, [Validators.required]],
          risksAndChallenges: [{value: data?.risksAndChallenges, disabled: this.isReadOnly}, [Validators.required]],
          learningAndDocumentation: [{value: data?.learningAndDocumentation, disabled: this.isReadOnly}, [Validators.required]],
          costOfProject: [{value: data?.costOfProject, disabled: this.isReadOnly}, [Validators.required]],
          attachment: [{value: data?.attachment, disabled: this.isReadOnly}, [Validators.required]],
          grantId: [{value: data?.grantId, disabled: this.isReadOnly}, [Validators.required]],
          processInstanceId: [{value: data?.processInstanceId, disabled: this.isReadOnly}, [Validators.required]],
          definitionKey: [{value: data?.definitionKey, disabled: this.isReadOnly}, [Validators.required]],
          status: [{value: data?.status, disabled: this.isReadOnly}, [Validators.required]],
          title: [{value: data?.title, disabled: this.isReadOnly}, [Validators.required]]
        });
      }, error => {
        console.log(error)
      })
    } else {this.setEmptyForm()}
  }

  setEmptyForm() {
    this.formGp = this.formBuilder.group({
      proposedDuration: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      proposedStartDate: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      amountRequested: [{value: null, disabled: this.isReadOnly}],
      otherSources: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      totalBudgetAmt: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      country: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      city: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      nameAuthorizedSignatory: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      contactAuthorizedSignatory: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      bankDetails: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      sixMonthsManaged: [{value:null, disabled: this.isReadOnly}, [Validators.required]],
      activitiesAndStrategies: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      risksAndChallenges: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      learningAndDocumentation: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      costOfProject: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      attachment: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      grantId: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      processInstanceId: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      definitionKey: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      status: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      title: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
    });
  }

  onSelectCountry(country) {
    this.countriesService.getCitiesForCountry(country).subscribe((response) => {
      this.cities = response.data;
    }, error => console.log(error))
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

    let apiUrl = `${this.grantProcessService.planningLearning}/getByProcessInstanceId`
    const params = new HttpParams().set('id', formData.processInstanceId);
    this.grantProcessService.getRecordByProcessInstanceId(apiUrl, params).subscribe((response:any) => {
      if(response?.results!=null) {
        this.grantProcessService.updatePlanningAndLearningRecord(formData, response.results.id).subscribe(data => {
          console.log(data)
          this.submitted = true
          this.error = false;
          this.success = true;
          this.successMessage = "Updated Application";
          this.alertService.success(this.successMessage);
          this.statusChanged.emit(this.status);
        }, error => {
          this.error = true;
          this.success = false;
          this.errorMessage = "Failed to update Application";
          this.alertService.error(this.errorMessage);
          console.log(error);
        });
      } else {
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
      }
    }, error => {console.log(error)})
    setTimeout(() => {
      if (this.success == true) {
        this.formGp.reset()
        this.router.navigate(['/home']);
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
      if (id === "attachment") this.formGp.patchValue({attachment: data.path});
      this.loading = false;
    }, error => {
      console.log(error)
    });
  }

  validateNumber(value) {
    this.inValidNumber = Validator.telephoneNumber(value)
  }

  saveDraft() {
    this.status = 'draft'
    this.submitLetter()
  }

  cancel() {
    this.formGp.reset()
    this.submitted = false
    window.location.reload();
  }
}
