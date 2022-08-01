import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../../services/users.service";
import {DatePipe} from "@angular/common";
import {ProgramStaffService} from "../../../services/program-staff.service";
import {ReferralsService} from "../../../services/referrals.service";
import {AlertService} from "../../../services/alert";
import {ScheduledTasksService} from "../../../services/scheduled-tasks.service";
import {AuthService} from "../../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ClientService} from "../../../services/client.service";
import {GenerateReferralComponent} from "../generate-referral/generate-referral.component";

@Component({
  providers: [GenerateReferralComponent],
  selector: 'app-referral-edit',
  templateUrl: './referral-edit.component.html',
  styleUrls: ['./referral-edit.component.css']
})
export class ReferralEditComponent implements OnInit {

  referrals: any;
  nationalityValue = '';
  followUpValue = '';
  searchValue = '';
  clients:any;
  staffs: any;
  runningJobs = [];
  allJobs = [];
  scheduledTasks: Object[];
  users: any;
  referralId:any;
  isReadOnly: Boolean;


  constructor(
    private userService: UsersService,
    private datePipe: DatePipe,
    private programStaffService: ProgramStaffService,
    private referralsService: ReferralsService,
    private alertService: AlertService,
    private scheduledTasksService: ScheduledTasksService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router,
    private generateReferralComponent: GenerateReferralComponent
  ) {
  }

  clicked = false;
  currentDashboards: any
  formGroup: FormGroup
  submitted = false;
  received_feedback = [
    {
      'name': 'Internal'
    },
    {
      'name': 'External'
    }
  ];
  nationality_status = [
    {
      'name': 'Foreigner'
    },
    {
      'name': 'Refugee'
    },
    {
      'name': 'National'
    }
  ];
  followup_needed = [
    {
      'name': 'Yes'
    },
    {
      'name': 'No'
    },
  ];

  internal = [
    {
      'name': 'Internal'
    },
    {
      'name': 'External'
    },
  ];
  followup_areas = [
    {
      'name': 'Follow Up Area 1'
    },
    {
      'name': 'Follow Up Area 2'
    },
    {
      'name': 'Follow Up Area 3'
    },
    {
      'name': 'Follow Up Area 4'
    },
    {
      'name': 'Follow Up Area 5'
    },

  ];

  irc_sector = [
    {
      'name': 'Health'
    },
    {
      'name': 'WPE'
    },
    {
      'name': 'Economic Recovery and Development'
    },
    {
      'name': 'Education'
    },
    {
      'name': 'PRoL'
    },

  ];
  reason_for_referral = [
    {
      'name': 'Food and Shelter'
    },
    {
      'name': 'Formal Education'
    },
    {
      'name': 'Insecurity'
    },
    {
      'name': 'Resettlement'
    },
    {
      'name': 'LGBTI'
    },
  ];
  age_category = [
    {
      'name': '0 - 28 days'
    },
    {
      'name': '29 days - 4 years'
    },
    {
      'name': '5 - 9 years'
    },
    {
      'name': '10 -19 years'
    },
    {
      'name': '20 - 29 years'
    },
    {
      'name': '30 - 59 years'
    },
    {
      'name': '60 years and above'
    },
  ];
  organization_referred_to = [
    {
      'name': 'IRC'
    },
    {
      'name': 'Relon'
    },
    {
      'name': 'Plavu'
    },
    {
      'name': 'Raising Gabdho Foundation'
    },
    {
      'name': 'Makasi Rescue Foundation'
    },
  ];

  identification_document = [
    {
      'name': 'National ID'
    },
    {
      'name': 'Alien Card'
    },
    {
      'name': 'Asylum Card'
    },
    {
      'name': 'Waiting card'
    },
    {
      'name': 'UNHCR Mandate'
    },
    {
      'name': 'Minors Pass'
    },
  ];
  country_of_origin = [
    {
      'name': 'Burundian'
    },
    {
      'name': 'Congolese'
    },
    {
      'name': 'Eritrean'
    },
    {
      'name': 'Ethiopian'
    },
    {
      'name': 'Nigerian'
    },
    {
      'name': 'Rwandese'
    },
    {
      'name': 'Somalian'
    },
    {
      'name': 'South Sudanese'
    },
    {
      'name': 'Tanzanian'
    },
    {
      'name': 'Ugandan'
    },
    {
      'name': 'Other'
    },
  ];

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.referralId = params['id'];
      this.isReadOnly = params['readonly'] == 'true';
      this.referralsService.getCurrentReferral(this.referralId).subscribe(data => {
        this.referrals = data;
        console.log(this.referrals);
        this.formGroup = this.formBuilder.group({
          dateOfReferral: [{value:(this.datePipe.transform(this.referrals.dateOfReferral, 'yyyy-MM-dd')),disabled: this.isReadOnly},[Validators.required]],
          nameOfReferringOfficer: [{value: this.referralId?.nameOfReferringOfficer,disabled: this.isReadOnly},[Validators.required]],
          nameOfClientBeingReferred: [{value: this.referrals?.nameOfClientBeingReferred || this.clients?.caseId, disabled: this.isReadOnly},[Validators.required]],
          phoneNumber: [{value: this.referrals?.phoneNumber,disabled: this.isReadOnly}],
          ageCategory: [{value: this.referrals?.ageCategory || this.clients?.ageCategory,disabled: this.isReadOnly}],
          countryOfOrigin: [{value:this.referrals?.countryOfOrigin || this.clients?.countryOfOrigin,disabled: this.isReadOnly}],
          district: [{value: this.referrals?.district || this.clients?.district, disabled: this.isReadOnly}],
          parish: [{value:this.referrals?.parish  || this.clients?.parish, disabled: this.isReadOnly}],
          division: [{value: this.referrals?.division || this.clients?.division, disabled: this.isReadOnly}],
          partnerName: [{value: this.referrals?.partnerName || this.clients?.partnerName, disabled: this.isReadOnly}],
          gender: [{value: this.referrals?.gender || this.clients?.gender, disabled: this.isReadOnly}],
          identificationDocument: [{ value: this.referrals?.identificationDocument || this.clients?.identificationDocument, disabled: this.isReadOnly}],
          identificationNumber: [{value: this.referrals?.identificationNumber || this.clients?.identificationNumber,disabled: this.isReadOnly}],
          reasonForReferral: [{value:this.referrals?.reasonForReferral, disabled: this.isReadOnly},[Validators.required]],
          organizationReferredTo: [{value:this.referrals?.organizationReferredTo, disabled: this.isReadOnly}],
          nationalityStatus: [{value: this.referrals?.nationalityStatus || this.clients?.nationality, disabled: this.isReadOnly}],
          followupNeeded: [{value: this.referrals?.followupNeeded, disabled: this.isReadOnly},[Validators.required]],
          disability: [{value: this.referrals?.disability || this.clients?.disability, disabled: this.isReadOnly}],
          assignee: [{value: this.referrals?.assignee, disabled: this.isReadOnly}],
          ircSector: [{value: this.referrals?.ircSector, disabled: this.isReadOnly}],
          internalExternal: [{value: this.referrals?.internalExternal, disabled: this.isReadOnly},[Validators.required]],
          status: [''],
        });
      });
    })
    this.startReferralProcess()
    this.loadProgramStaff();
    this.loadClients();
  }



  createClient() {
    this.router.navigate(['/create-referral']);
  }

  createReferral() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const submitData = this.formGroup.value;
    submitData.status = 'Not Actioned';
    console.log("formdata",submitData)
    this.referralsService.updateReferral(this.referralId,submitData).subscribe((result) => {
      console.warn(result, 'Referral Created Successfully');
      this.alertService.success(`Referral has been successfully created`)
      this.router.navigate(['/referrals/list']);
    }, error => {
      this.alertService.error(`Failed to create Referral`)
    });
  }

  removeValidationForSavingDraft(){
    this.formGroup.get('nameOfReferringOfficer').setValidators(null);
    this.formGroup.get('nameOfReferringOfficer').updateValueAndValidity();
    this.formGroup.get('reasonForReferral').setValidators(null);
    this.formGroup.get('reasonForReferral').updateValueAndValidity();
    this.formGroup.get('followupNeeded').setValidators(null);
    this.formGroup.get('followupNeeded').updateValueAndValidity();
    this.formGroup.get('internalExternal').setValidators(null);
    this.formGroup.get('internalExternal').updateValueAndValidity();
    this.formGroup.get('dateOfReferral').setValidators(null);
    this.formGroup.get('dateOfReferral').updateValueAndValidity();
    this.formGroup.get('nameOfClientBeingReferred').setValidators(null);
    this.formGroup.get('nameOfClientBeingReferred').updateValueAndValidity();
  }

  saveReferral() {
    this.clicked = true;
    this.submitted = true;
    this.removeValidationForSavingDraft();
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const submitData = this.formGroup.value;
    //append status
    submitData.status = 'Pending'
    console.log("formdata",submitData)
    this.referralsService.updateReferral(this.referralId,submitData).subscribe((result) => {
      console.warn(result, 'Referral Saved Successfully');
      this.alertService.success(`Referral has been successfully saved`)
      this.router.navigate(['/referrals/list']);
    }, error => {
      this.alertService.error(`Failed to create Referral`)
    });
  }

  close() {
    this.router.navigate(['/referrals/list'])
  }

  loadProgramStaff(){
    this.userService.getUsers().subscribe((data) => {
      this.staffs = data;
    });
  }

  loadClients(){
    this.clientService.getClients().subscribe((data) =>{
      this.clients = data;
    })
  }

  onChangeCountry(event) {
    console.log(event, "nationality")
    if (!event) {
      this.nationalityValue = ''
      document.getElementById('country_of_origin').hidden = true
      this.formGroup.controls['countryOfOrigin'].reset();
    } else {
      this.nationalityValue = event;
      if (this.nationalityValue === "National") {
        document.getElementById('country_of_origin').hidden = true
      } else {
        document.getElementById('country_of_origin').hidden = false
      }

    }
  }

  startReferralProcess(){
    this.scheduledTasksService.getScheduledTasks().subscribe((data) => {
      console.log("tasks",data)
      this.scheduledTasks = data['taskdef'];
      this.allJobs = data['jobs'];
      this.runningJobs = data['runningJobs'];
    })
  }

  onChangeFollowUp(event) {
    if (!event) {
      this.followUpValue = ''
      document.getElementById('assignee').hidden = true
      document.getElementById('followupAreas').hidden = true
      this.formGroup.controls['assignee'].reset();
      this.formGroup.controls['followupAreas'].reset();
    } else {
      this.followUpValue = event;
      if (this.followUpValue === "No") {
        document.getElementById('assignee').hidden = true
        document.getElementById('followupAreas').hidden = true
        this.formGroup.controls['assignee'].reset();
        this.formGroup.controls['followupAreas'].reset();
      } else {
        document.getElementById('assignee').hidden = false
        document.getElementById('followupAreas').hidden = false
      }

    }
  }

  deleteReferral() {
    if (confirm('Are you sure to delete this Referral?')) {
      console.log(
        this.referralsService.deleteCurrentReferral(this.route.snapshot.params.id).subscribe((result) => {
            console.warn(result, 'Referral has been deleted');
            this.alertService.warning(`Referral has been deleted`)
            this.router.navigate(['/referrals/list']);
          }, error => {
            this.alertService.error(`Failed to delete Referral`)
          }
        ));
    }
  }

  reloadForm(){
    this.ngOnInit();
  }

  onChangeSearch(event) {
    console.log(event)
    this.clientService.getCurrentClient(event).subscribe(data =>{
      this.clients = data;
      this.reloadForm()
    })
  }

  onChangeInternalUp(event) {
    document.getElementById("ircSector").hidden = event !== 'Internal';
    document.getElementById("orgReferredTo").hidden = event === 'Internal';
  }
}
