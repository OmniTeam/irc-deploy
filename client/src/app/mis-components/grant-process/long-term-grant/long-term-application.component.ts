import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountriesService} from "../../../services/countries.service";
import {FileUploadService} from "../../../services/file-upload.service";
import {Validator} from "../../../helpers/validator";
import {TempDataService} from "../../../services/temp-data.service";
import {AlertService} from "../../../services/alert";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskListService} from "../../../services/task-list.service";

@Component({
  selector: 'long-term-application',
  templateUrl: './long-term-application.component.html',
  styleUrls: ['../grant-process.component.css']
})

export class LongTermApplicationComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @Input() isMakeCorrections: boolean;
  @Input() grantId: string;
  @Input() processInstanceId: string;
  @Input() definitionKey: string;
  @Output() statusChanged: EventEmitter<string> = new EventEmitter();
  @Output() valuesChanged: EventEmitter<string> = new EventEmitter();

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
    private alertService: AlertService,
    private taskListService: TaskListService
  ) {
  }

  get f() {
    return this.formGroupLT.controls;
  }

  ngOnInit(): void {
    this.countries = this.countriesService.getListOfAvailableCountries();

    if (this.isReadOnly || this.isMakeCorrections) {
      this.tempDataService.getTempRecordByValue(this.grantId).subscribe((data: any) => {
        if (data.some(x => x.type === 'application')) {
          data.forEach(it => {
            if (it.type === 'application') {
              let results: any
              if (it.json_value != undefined) {
                results = JSON.parse(it.json_value)
                if (results.documents != undefined) this.documents = JSON.parse(results.documents)
              }

              this.formGroupLT = this.formBuilder.group({
                projectTitle: [{value: results?.projectTitle, disabled: this.isReadOnly}, [Validators.required]],
                projectDuration: [{value: results?.projectDuration, disabled: this.isReadOnly}, [Validators.required]],
                projectProposed: [{value: results?.projectProposed, disabled: this.isReadOnly}, [Validators.required]],
                projectAmount: [{value: results?.projectAmount, disabled: this.isReadOnly}, [Validators.required]],
                amountRequested: [{value: results?.amountRequested, disabled: this.isReadOnly}, [Validators.required]],
                funding: [{value: results?.funding, disabled: this.isReadOnly}, [Validators.required]],
                nameAuthorizedSignatory: [{value: results?.nameAuthorizedSignatory, disabled: this.isReadOnly}, [Validators.required]],
                contactAuthorizedSignatory: [{value: results?.contactAuthorizedSignatory, disabled: this.isReadOnly}, [Validators.required]],
                bankDetails: [{value: results?.bankDetails, disabled: this.isReadOnly}, [Validators.required]],

                problemBackground: [{value: results?.problemBackground, disabled: this.isReadOnly}, [Validators.required]],
                problemAddressed: [{value: results?.problemAddressed, disabled: this.isReadOnly}, [Validators.required]],
                targetPopulation: [{value: results?.targetPopulation, disabled: this.isReadOnly}, [Validators.required]],
                reasonForTargetPopulation: [{value: results?.reasonForTargetPopulation, disabled: this.isReadOnly}, [Validators.required]],
                whatChangeExpected: [{value: results?.whatChangeExpected, disabled: this.isReadOnly}, [Validators.required]],
                overallGoal: [{value: results?.overallGoal, disabled: this.isReadOnly}, [Validators.required]],
                midtermChanges: [{value: results?.midtermChanges, disabled: this.isReadOnly}, [Validators.required]],
                immediateChanges: [{value: results?.immediateChanges, disabled: this.isReadOnly}, [Validators.required]],
                activities: [{value: results?.activities, disabled: this.isReadOnly}, [Validators.required]],
                risksAndChallenges: [{value: results?.risksAndChallenges, disabled: this.isReadOnly}, [Validators.required]],
                partnershipsAndNetworks: [{value: results?.partnershipsAndNetworks, disabled: this.isReadOnly}, [Validators.required]],
                changeEnvisioned: [{value: results?.changeEnvisioned, disabled: this.isReadOnly}, [Validators.required]],
                structuresAndPlans: [{value: results?.structuresAndPlans, disabled: this.isReadOnly}, [Validators.required]],
                totalProjectCostLocalCurrency: [{value: results?.totalProjectCostLocalCurrency, disabled: this.isReadOnly}, [Validators.required]],
                totalProjectCostDollars: [{value: results?.totalProjectCostDollars, disabled: this.isReadOnly}, [Validators.required]],
                documents: [{value: results?.documents, disabled: this.isReadOnly}],

                grantId: [{value: results?.grantId}, [Validators.required]],
                processInstanceId: [{value: results?.processInstanceId}],
                definitionKey: [{value: results?.definitionKey}],
                status: [{value: results?.status}],
              });
            }
          })
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
      projectDuration: [null, [Validators.required]],
      projectProposed: [null, [Validators.required]],
      projectAmount: [null, [Validators.required]],
      amountRequested: [null, [Validators.required]],
      funding: [null, [Validators.required]],
      nameAuthorizedSignatory: [null, [Validators.required]],
      contactAuthorizedSignatory: [null, [Validators.required]],
      bankDetails: [null, [Validators.required]],

      problemBackground: [null, [Validators.required]],
      problemAddressed: [null, [Validators.required]],
      targetPopulation: [null, [Validators.required]],
      reasonForTargetPopulation: [null, [Validators.required]],
      whatChangeExpected: [null, [Validators.required]],
      overallGoal: [null, [Validators.required]],
      midtermChanges: [null, [Validators.required]],
      immediateChanges: [null, [Validators.required]],
      activities: [null, [Validators.required]],
      risksAndChallenges: [null, [Validators.required]],
      partnershipsAndNetworks: [null, [Validators.required]],
      changeEnvisioned: [null, [Validators.required]],
      structuresAndPlans: [null, [Validators.required]],
      totalProjectCostLocalCurrency: [null, [Validators.required]],
      totalProjectCostDollars: [null, [Validators.required]],
      documents: [null],

      grantId: [null, [Validators.required]],
      processInstanceId: [null],
      definitionKey: [null],
      status: [null],
    });
  }

  validate = (obj, validations) =>
    validations.every(key => ![undefined, null].includes(key.split('.').reduce((acc, cur) => acc?.[cur], obj)));

  submitLetter() {
    this.submitted = true;
    console.log("formData", this.formGroupLT.value)
    if (this.formGroupLT.invalid || this.inValidNumber) {
      this.alertService.error("Please fill in all fields correctly");
      return;
    }
    let documentsAllFilled = this.validate(this.documents, ['detailedBudget', 'workplan', 'framework', 'clusterGuideline', 'mou', 'staffMembers'])
    if (!documentsAllFilled) {
      this.alertService.error("Please fill in all compulsory fields in Part H");
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
      if (data.some(x => x.type === 'application')) {
        data.forEach(it => {
          if (it.type === 'application') {
            this.tempDataService.updateTempData(formDataR, it.id).subscribe(res => {
              console.log("response", res)
              this.submitted = true
              this.error = false;
              this.success = true;
              this.successMessage = "Submitted Application";
              this.alertService.success(this.successMessage);
              this.statusChanged.emit(this.status);
            }, error => {
              this.error = true;
              this.success = false;
              this.errorMessage = "Failed to submit Application";
              this.alertService.error(this.errorMessage);
              console.log(error);
            });
          }
        });
      } else {
        this.tempDataService.createTempData(formDataR).subscribe(res => {
          console.log("response", res)
          this.submitted = true
          this.error = false;
          this.success = true;
          this.successMessage = "Submitted Application";
          this.alertService.success(this.successMessage);
          this.statusChanged.emit(this.status);
        }, error => {
          this.error = true;
          this.success = false;
          this.errorMessage = "Failed to submitted Application";
          this.alertService.error(this.errorMessage);
          console.log(error);
        });
      }
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

  updateOutputVariables(value: string) {
    if(this.isMakeCorrections) this.valuesChanged.emit(value);
  }

}
