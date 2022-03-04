import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {ProgramPartnersService} from "../../../services/program-partners.service";

@Component({
  selector: 'app-create-program-partners',
  templateUrl: './create-program-partners.component.html',
  styleUrls: ['./create-program-partners.component.css']
})
export class CreateProgramPartnersComponent implements OnInit {

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  programs = [];
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private programPartnersService: ProgramPartnersService) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      program: ['', [Validators.required]],
      name: ['', [Validators.required]],
      leadCluster: [''],
      physicalAddress: [''],
      postalAddress: [''],
      acronym: [''],
      email: [''],
      organisation: [''],
      website: [''],
      legal: [''],
      country: [''],
      nameContactPerson: [''],
      city: ['']
    });
    this.programPartnersService.getPrograms().subscribe((data) => {
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
    const programPartner = this.formGroup.value;
    this.programPartnersService.createProgramPartner(programPartner).subscribe(results => {
      this.router.navigate(['/programPartner']);
      this.alertService.success(`${programPartner.name} has been successfully created `);
    }, error => {
      this.alertService.error(`${programPartner.name} could not be created`);
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
