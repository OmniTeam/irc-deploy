import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

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

  constructor() { }

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
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

  cancel() {
    this.formGroup.reset()
    this.submitted = false
  }


}
