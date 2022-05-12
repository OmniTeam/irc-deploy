import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountriesService} from "../../services/countries.service";
import {SampleData} from "../../helpers/sample-data";
import {FileUploadService} from "../../services/file-upload.service";
import {GrantProcessService} from "../../services/grant-process.service";

@Component({
  selector: 'application-letter',
  templateUrl: './application-letter.component.html',
  styleUrls: ['./grant-process.component.css']
})

export class ApplicationLetterComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @Output() readOnlyChanged: EventEmitter<boolean> = new EventEmitter();

  formGroup: FormGroup;
  submitted = false;
  organizationType = [
    {id: "1", name: "my type"}
  ];
  countries: any;
  cities: any;
  programs = [
    {id: "1", name: "Adolescent Girl Power Program"},
    {id: "2", name: "Youth Capacity Development Program"},
    {id: "3", name: "Prevention of Violence Against Children and Adolescents"},
  ];
  private letterOfInterest: any;

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
    //this.readOnlyChanged.emit(false);
    this.countries = this.countriesService.getListOfCountries();

    this.letterOfInterest = SampleData.letterOfInterest;

    if (this.letterOfInterest != null && this.isReadOnly) {
      this.formGroup = this.formBuilder.group(this.letterOfInterest)
    } else {
      this.formGroup = this.formBuilder.group({
        program: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        organisation: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        acronym: [{value: '', disabled: this.isReadOnly}],
        organization_type: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        legal_status: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        contact_person: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        address_contact_person: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        email_address: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        contact_person_number: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        physical_address: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        postal_address: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        email: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
        website: [{value: '', disabled: this.isReadOnly}],
        country: [{value: '', disabled: this.isReadOnly}],
        city: [{value: '', disabled: this.isReadOnly}],
        letter_attachment: [{value: '', disabled: this.isReadOnly}],
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
    this.letterOfInterest = formData;
    console.log('formData', formData)

    this.grantProcessService.createLetterOfInterest(formData).subscribe(data => {
      console.log(data)
    }, error => {console.log(error)})
  }

  onSelectCountry(country) {
    this.countriesService.getCitiesForCountry(country).subscribe((response) => {
      this.cities = response.data;
    }, error => console.log(error))
  }

  cancel() {
    this.formGroup.reset()
    this.submitted = false
  }
}
