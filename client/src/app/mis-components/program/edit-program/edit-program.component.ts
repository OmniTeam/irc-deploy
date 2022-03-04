import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {ProgramService} from "../../../services/program.service";

@Component({
  selector: 'app-edit-program',
  templateUrl: './edit-program.component.html',
  styleUrls: ['./edit-program.component.css']
})
export class EditProgramComponent implements OnInit {

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  programId: any;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private programService: ProgramService) { }

  ngOnInit(): void {
    this.programId = this.route.snapshot.params.id
    this.programService.getCurrentProgram(this.programId).subscribe((results: any) => {
      this.formGroup = this.formBuilder.group({
        title: [results?.title, [Validators.required]],
        description: [results?.description]
      });
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  editProgram() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    this.formData = this.formGroup.value;
    this.programService.updateProgram(this.programId, this.formData).subscribe(results => {
      this.router.navigate(['/program']);
      this.alertService.success(`${this.formGroup.value.title} has been successfully updated `);
    }, error => {
      this.alertService.error(`${this.formGroup.value.title} could not be updated`);
    });

    if (this.formGroup.valid) {
      setTimeout(() => {
        this.formGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  cancel(): void {
    window.history.back();
  }


}
