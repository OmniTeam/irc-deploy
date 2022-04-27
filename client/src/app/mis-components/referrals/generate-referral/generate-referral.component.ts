import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../../services/users.service";
import {DatePipe} from "@angular/common";
import {ProgramStaffService} from "../../../services/program-staff.service";
import {ReferralsService} from "../../../services/referrals.service";
import {AlertService} from "../../../services/alert";
import {CountriesService} from "../../../services/countries.service";
import {AuthService} from "../../../services/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ScheduledTasksService} from "../../../services/scheduled-tasks.service";
import {HttpParams} from "@angular/common/http";
import {ClientService} from "../../../services/client.service";

@Component({
  selector: 'app-generate-referral',
  templateUrl: './generate-referral.component.html',
  styleUrls: ['./generate-referral.component.css']
})
export class GenerateReferralComponent implements OnInit {

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


  constructor(
    private userService: UsersService,
    private datePipe: DatePipe,
    private CountriesService: CountriesService,
    private programStaffService: ProgramStaffService,
    private referralsService: ReferralsService,
    private alertService: AlertService,
    private scheduledTasksService: ScheduledTasksService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router
  ) {
  }

  clicked = false;
  currentDashboards: any
  formGroup: FormGroup
  submitted = false;
  received_feedback = [
    {
      'name': 'Yes'
    },
    {
      'name': 'No'
    },
    {
      'name': 'Not Known'
    },
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
  reason_for_referral = [
    {
      'name': 'Food amd Shelter'
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
      'name': 'AVSI FOUNDATION'
    },
    {
      'name': 'JRS'
    },
    {
      'name': 'REFUGEPOINT'
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
  country_of_origin: any;

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.CountriesService.getCountries().subscribe(data => {
      this.country_of_origin = data
    }, error => {
      this.alertService.error("Failed to get Countries")
    })

    this.startReferralProcess()

      this.loadProgramStaff();
      this.loadClients();
      // this.referrals = data
      this.formGroup = this.formBuilder.group({
        dateOfReferral: [(this.datePipe.transform('', 'yyyy-MM-dd'))],
        nameOfReferringOfficer: [''],
        nameOfClientBeingReferred: ['' || this.clients?.caseId],
        phoneNumber: [''],
        ageCategory: ['' || this.clients?.ageCategory],
        countryOfOrigin: ['' || this.clients?.countryOfOrigin],
        district: ['' || this.clients?.district],
        parish: ['' || this.clients?.parish],
        division: ['' || this.clients?.division],
        partnerName: ['' || this.clients?.partnerName],
        gender: ['' || this.clients?.gender],
        identificationDocument: ['' || this.clients?.identificationDocument],
        identificationNumber: ['' || this.clients?.identificationNumber],
        reasonForReferral: ['' ],
        organizationReferredTo: [''],
        nationalityStatus: ['' || this.clients?.nationality],
        followupNeeded: [''],
        disability: ['' || this.clients?.disability],
        assignee: [''],
        status: ['Pending'],
      });

    // })
  }

  // createReferral() {
  //   this.router.navigate(['/referrals-list']);
  // }

  // runJobNow(taskName) {
  //   console.log(taskName)
  //   this.createReferral()
  //   const params = new HttpParams()
  //     .set('taskName', taskName);
  //   this.scheduledTasksService.runScheduledTask(params).subscribe((data) => {
  //     // this.reloadTable();
  //     this.alertService.success(`${taskName} has been triggered`);
  //   }, error => {
  //     this.alertService.error(`${taskName} has not been triggered`);
  //   });
  // }

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
    console.log("formdata",submitData)
    this.referralsService.createReferral(submitData).subscribe((result) => {
      console.warn(result, 'Referral Created Successfully');
      this.alertService.success(`Referral has been successfully created`)
      this.router.navigate(['/referrals-list']);
    }, error => {
      this.alertService.error(`Failed to create Referral`)
    });
  }

  close() {
    this.router.navigate(['/referrals-list'])
  }

  loadProgramStaff(){
    this.userService.getUsers().subscribe((data) => {
      this.staffs = data;
      console.log(data)
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
    console.log(event, "nationality")
    if (!event) {
      this.followUpValue = ''
      // document.getElementById('followupAreas').hidden = true
      // document.getElementById('followupOrganization').hidden = true
      document.getElementById('assignee').hidden = true
      // this.formGroup.controls['followupAreas'].reset();
      // this.formGroup.controls['followupOrganization'].reset();
      this.formGroup.controls['assignee'].reset();
    } else {
      this.followUpValue = event;
      if (this.followUpValue === "No") {
        // document.getElementById('followupAreas').hidden = true
        // document.getElementById('followupOrganization').hidden = true
        document.getElementById('assignee').hidden = true
        // this.formGroup.controls['followupAreas'].reset();
        // this.formGroup.controls['followupOrganization'].reset();
        this.formGroup.controls['assignee'].reset();
      } else {
        // document.getElementById('followupAreas').hidden = false
        // document.getElementById('followupOrganization').hidden = false
        document.getElementById('assignee').hidden = false
      }

    }
  }

  deleteReferral() {
    if (confirm('Are you sure to delete this Referral?')) {
      console.log(
        this.referralsService.deleteCurrentReferral(this.route.snapshot.params.id).subscribe((result) => {
            console.warn(result, 'Referral has been deleted');
            this.alertService.warning(`Referral has been deleted`)
            this.router.navigate(['/referrals-list']);
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
    // this.searchValue = event.target.value
    // if(!this.searchValue){
    //   // this.reloadTable()
    // } else {
    //   this.clients = this.clients.filter(a => a.name_of_client_being_referred.toUpperCase().includes(this.searchValue.toUpperCase()))
    // }
  }
}
