import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {ProgramService} from "../../../services/program.service";

@Component({
  selector: 'app-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.css']
})
export class CreateProgramComponent implements OnInit {

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private programService: ProgramService) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['']
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  createProgram() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    this.formData = this.formGroup.value;
    this.programService.createProgram(this.formData).subscribe(results => {
      this.router.navigate(['/program']);
      this.alertService.success(`${this.formData.title} has been successfully created `);
    }, error => {
      this.alertService.error(`${this.formData.title} could not be created`);
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
