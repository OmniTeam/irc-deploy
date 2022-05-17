import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountriesService} from "../../services/countries.service";
import {SampleData} from "../../helpers/sample-data";
import {FileUploadService} from "../../services/file-upload.service";
import {GrantProcessService} from "../../services/grant-process.service";
import {Router} from "@angular/router";
import {AlertService} from "../../services/alert";

@Component({
  selector: 'application-letter',
  templateUrl: './application-letter.component.html',
  styleUrls: ['./grant-process.component.css']
})

export class ApplicationLetterComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @Input() grantId: string;

  formGroup: FormGroup;
  submitted = false;
  loading: boolean;
  organizationType = [
    {id: "1", name: "my type"}
  ];
  status = 'not_started';
  countries: any;
  cities: any;
  programs = [
    {id: "1", name: "Adolescent Girl Power Program"},
    {id: "2", name: "Youth Capacity Development Program"},
    {id: "3", name: "Prevention of Violence Against Children and Adolescents"},
  ];
  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;

  constructor(
    private router: Router,
    private countriesService: CountriesService,
    private formBuilder: FormBuilder,
    public fileUploadService: FileUploadService,
    private grantProcessService: GrantProcessService,
    private alertService: AlertService
  ) {
  }

  get f() {
    return this.formGroup?.controls;
  }

  ngOnInit(): void {
    this.countries = this.countriesService.getListOfCountries();

    if (!this.isReadOnly) {
      this.setEmptyForm()
    } else {
      this.grantProcessService.getLetterOfInterest(this.grantId).subscribe((data: any) => {
        if (data != null) {
          this.formGroup = this.formBuilder.group({
            program: [{value: data.program, disabled: this.isReadOnly}, [Validators.required]],
            organisation: [{value: data.organisation, disabled: this.isReadOnly}, [Validators.required]],
            acronym: [{value: data.acronym, disabled: this.isReadOnly}],
            organizationType: [{value: data.organizationType, disabled: this.isReadOnly}, [Validators.required]],
            legalStatus: [{value: data.legalStatus, disabled: this.isReadOnly}, [Validators.required]],
            contactPerson: [{value: data.contactPerson, disabled: this.isReadOnly}, [Validators.required]],
            addressContactPerson: [{
              value: data.addressContactPerson,
              disabled: this.isReadOnly
            }, [Validators.required]],
            emailAddress: [{value: data.emailAddress, disabled: this.isReadOnly}, [Validators.required]],
            contactPersonNumber: [{value: data.contactPersonNumber, disabled: this.isReadOnly}, [Validators.required]],
            physicalAddress: [{value: data.physicalAddress, disabled: this.isReadOnly}, [Validators.required]],
            postalAddress: [{value: data.postalAddress, disabled: this.isReadOnly}, [Validators.required]],
            email: [{value: data.email, disabled: this.isReadOnly}, [Validators.required]],
            website: [{value: data.website, disabled: this.isReadOnly}],
            country: [{value: data.country, disabled: this.isReadOnly}],
            city: [{value: data.city, disabled: this.isReadOnly}],
            letterAttachment: [{value: data.letterAttachment, disabled: this.isReadOnly}],
            status: [data.status],
          });
        }
      })
    }
  }

  setEmptyForm() {
    this.formGroup = this.formBuilder.group({
      program: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      organisation: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      acronym: [{value: '', disabled: this.isReadOnly}],
      organizationType: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      legalStatus: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      contactPerson: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      addressContactPerson: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      emailAddress: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      contactPersonNumber: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      physicalAddress: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      postalAddress: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      email: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      website: [{value: '', disabled: this.isReadOnly}],
      country: [{value: '', disabled: this.isReadOnly}],
      city: [{value: '', disabled: this.isReadOnly}],
      letterAttachment: [{value: '', disabled: this.isReadOnly}],
      status: [null],
    });
  }

  submitLetter() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      this.alertService.error("Please fill in all fields correctly");
      return;
    }
    const formData = this.formGroup.value;
    console.log('formData', formData)

    this.grantProcessService.createLetterOfInterest(formData).subscribe(data => {
      console.log(data)
      this.submitted = true
      this.error = false;
      this.success = true;
      this.successMessage = "Saved Application";
      this.alertService.success(this.successMessage);
    }, error => {
      this.error = true;
      this.success = false;
      this.errorMessage = "Failed to save Application";
      this.alertService.error(this.errorMessage);
      console.log(error);
    });
    setTimeout(() => {
      if (this.success == true) {
        (document.getElementById('letterOfAttachment') as HTMLInputElement).value = ''
        this.formGroup.reset()
        this.onBackPressed()
      }
      this.success = false;
      this.error = false;
    }, 3000);
  }

  /*attachments*/
  handleFileInput(event) {
    let files: FileList = event.target.files;
    this.uploadFile(files.item(0), event.target.id);
  }

  uploadFile(file, id) {
    this.loading = !this.loading;
    console.log(file);
    this.fileUploadService.upload(file).subscribe((data) => {
        if (id === "letterOfAttachment") this.formGroup.patchValue({letterAttachment: data.path});
        this.loading = false;
      }, error => {
        console.log(error);
      }
    );
  }

  onSelectCountry(country) {
    this.countriesService.getCitiesForCountry(country).subscribe((response) => {
      this.cities = response.data;
    }, error => console.log(error))
  }


  saveDraft(){
    this.status = 'draft'
    this.submitLetter()
  }

  cancel() {
    (document.getElementById('letterOfAttachment') as HTMLInputElement).value = ''
    this.formGroup.reset()
    this.submitted = false
  }

  onBackPressed() {
    this.router.navigate(['/grantProcess']);
  }
}
