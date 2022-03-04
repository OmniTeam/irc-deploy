import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {ProgramCategoryService} from "../../../services/program-category.service";

@Component({
  selector: 'app-edit-program-category',
  templateUrl: './edit-program-category.component.html',
  styleUrls: ['./edit-program-category.component.css']
})
export class EditProgramCategoryComponent implements OnInit {

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  programs = [];
  programCategoryId: any;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private programCategoryService: ProgramCategoryService) { }

  ngOnInit(): void {
    this.programCategoryId = this.route.snapshot.params.id
    this.programCategoryService.getCurrentProgramCategory(this.programCategoryId).subscribe((results: any) => {
      this.formGroup = this.formBuilder.group({
        name: [results?.name, [Validators.required]],
        description: [results?.description],
        program: [results?.programId]
      });
    });
    this.programCategoryService.getPrograms().subscribe((data) => {
      this.programs = data;
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  editProgramCategory() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    this.formData = this.formGroup.value;
    this.programCategoryService.updateProgramCategory(this.programCategoryId,  this.formData).subscribe(results => {
      this.router.navigate(['/programCategory']);
      this.alertService.success(`Program Category has been successfully updated `);
    }, error => {
      this.alertService.error(`Program Category could not be updated`);
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
