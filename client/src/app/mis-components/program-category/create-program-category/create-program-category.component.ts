import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {ProgramCategoryService} from "../../../services/program-category.service";

@Component({
  selector: 'app-create-program-category',
  templateUrl: './create-program-category.component.html',
  styleUrls: ['./create-program-category.component.css']
})
export class CreateProgramCategoryComponent implements OnInit {

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  programs = [];
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private programCategoryService: ProgramCategoryService) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      program: [''],
    });
    this.programCategoryService.getPrograms().subscribe((data) => {
      this.programs = data;
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  createProgramCategory() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const programCategory = this.formGroup.value;
    console.log(programCategory);
    this.programCategoryService.createProgramCategory(programCategory).subscribe(results => {
      this.router.navigate(['/programCategory']);
      this.alertService.success(`Program Category has been successfully created `);
    }, error => {
      this.alertService.error(`Program Category could not be created`);
    });

    if (this.formGroup.valid) {
      setTimeout(() => {
        this.formGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  onReset() {
    this.formGroup.reset();
  }

}
