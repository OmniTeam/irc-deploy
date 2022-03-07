import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {ProgramStaffService} from "../../../services/program-staff.service";

@Component({
  selector: 'app-edit-program-staff',
  templateUrl: './edit-program-staff.component.html',
  styleUrls: ['./edit-program-staff.component.css']
})
export class EditProgramStaffComponent implements OnInit {

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  programs = [];
  programStaffId: any;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private programStaffService: ProgramStaffService) { }

  ngOnInit(): void {
    this.programStaffId = this.route.snapshot.params.id;
    this.programStaffService.getCurrentProgramStaff(this.programStaffId).subscribe((results: any) => {
      this.formGroup = this.formBuilder.group({
        program: [results?.programId, [Validators.required]],
        name: [results?.name, [Validators.required]],
        email: [results?.email],
        nameContactPerson: [results?.nameContactPerson],
        personContact: [results?.personContact]
      });
    });
    this.programStaffService.getPrograms().subscribe((data) => {
      this.programs = data;
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  editProgramStaff() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const programStaff = this.formGroup.value;
    this.programStaffService.updateProgramStaff(this.programStaffId, programStaff).subscribe(results => {
      this.router.navigate(['/programStaff']);
      this.alertService.success(`${programStaff.name} has been successfully updated `);
    }, error => {
      this.alertService.error(`${programStaff.name} could not be updated`);
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
