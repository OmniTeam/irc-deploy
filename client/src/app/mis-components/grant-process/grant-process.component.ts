import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UsernameValidator} from "../../validators/username.validator";
import {CountriesService} from "../../services/countries.service";

@Component({
  selector: 'app-grant-process',
  templateUrl: './grant-process.component.html',
  styleUrls: ['./grant-process.component.css']
})
export class GrantProcessComponent implements OnInit {
  isSubmitLetterOfInterest: boolean;
  isReviewLetterOfInterest: boolean;
  isPlanningLearningApplication: boolean;
  isReviewLearningGrant: boolean;
  isApprovePlanningLearningGrant: boolean;
  isProvidePlanningLearningGrant: boolean;

  formGroup: FormGroup;
  submitted = false;
  organizationType: [
    {id:"1", name:"my type"}
  ] ;
  countries: any;
  cities: any;
  programs: [
    {id:"1", name:"Adolescent Girl Power Program"},
    {id:"2", name:"Youth Capacity Development Program"},
    {id:"3", name:"Prevention of Violence Against Children and Adolescents"},
  ] ;

  constructor(
    private countriesService: CountriesService,
    private formBuilder: FormBuilder
  ) { }

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.countries = this.countriesService.getListOfCountries();

    this.formGroup = this.formBuilder.group({
      program: ['', [Validators.required]],
      organisation: ['', [Validators.required]],
      acronym: [null],
      organization_type: ['', [Validators.required]],
      legal_status: ['', [Validators.required]],
      contact_person: ['', [Validators.required]],
      address_contact_person: ['', [Validators.required]],
      email_address: ['', [Validators.required]],
      contact_person_number: ['', [Validators.required]],
      physical_address: ['', [Validators.required]],
      postal_address: ['', [Validators.required]],
      email: ['', [Validators.required]],
      website: [null],
      country: [null],
      city: [null],
      attachment: [null],
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
  }

  onSelectCountry(country){
    this.countriesService.getCitiesForCountry(country).subscribe((response)=>{
      this.cities = response.data;
    }, error => console.log(error))
  }

  cancel() {
    this.formGroup.reset()
    this.submitted = false
  }


}
