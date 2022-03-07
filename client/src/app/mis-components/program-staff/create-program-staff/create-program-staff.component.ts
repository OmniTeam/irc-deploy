import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {ProgramStaffService} from "../../../services/program-staff.service";

@Component({
  selector: 'app-create-program-staff',
  templateUrl: './create-program-staff.component.html',
  styleUrls: ['./create-program-staff.component.css']
})
export class CreateProgramStaffComponent implements OnInit {

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  programs = [];
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private programStaffService: ProgramStaffService) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      program: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: [''],
      nameContactPerson: [''],
      personContact: ['']
    });
    this.programStaffService.getPrograms().subscribe((data) => {
      this.programs = data;
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  createProgramPartner() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const programStaff = this.formGroup.value;
    this.programStaffService.createProgramStaff(programStaff).subscribe(results => {
      this.router.navigate(['/programStaff']);
      this.alertService.success(`${programStaff.name} has been successfully created `);
    }, error => {
      this.alertService.error(`${programStaff.name} could not be created`);
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
