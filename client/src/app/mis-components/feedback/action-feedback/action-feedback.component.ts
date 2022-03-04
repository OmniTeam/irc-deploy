import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {UsersService} from "../../../services/users.service";
import {AlertService} from "../../../services/alert";
import {ReferralsService} from "../../../services/referrals.service";
import {CountriesService} from "../../../services/countries.service";
import {parseDate} from "devextreme/localization";
import {format} from "d3";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-createReferral',
  templateUrl: './action-feedback.component.html',
  styleUrls: ['./action-feedback.component.scss']
})
export class ActionFeedbackComponent implements OnInit {
  private referrals: any;
  private nationalityValue='';
  private followUpValue = '';

  constructor(
    private userService: UsersService,
    private datePipe: DatePipe,
    private CountriesService: CountriesService,
    private referralsService: ReferralsService,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
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
    this.CountriesService.getCountries().subscribe(data =>{
      this.country_of_origin=data
    }, error => {this.alertService.error("Failed to get Countries")})
    this.referralsService.getCurrentReferral(this.route.snapshot.params.id).subscribe(data => {
      console.log(data,"referral data")

      this.referrals = data
      let myDate = this.datePipe.transform(this.referrals.date_of_referral, 'dd-MM-yyyy')
      console.log(myDate," this is the date formatted")
      this.formGroup = this.formBuilder.group({
        date_of_referral: [(this.datePipe.transform(this.referrals.date_of_referral, 'yyyy-MM-dd'))],
        name_of_referring_officer: [this.referrals?.name_of_referring_officer],
        name_of_client_being_referred: [this.referrals?.name_of_client_being_referred],
        phone_number: [this.referrals?.phone_number],
        date_of_birth: [this.datePipe.transform(this.referrals.date_of_birth, 'yyyy-MM-dd')],
        age_category: [this.referrals?.age_category],
        country_of_origin: [this.referrals?.country_of_origin],
        identification_document: [this.referrals?.identification_document],
        identification_number: [this.referrals?.identification_number],
        reason_for_referral: [this.referrals?.reason_for_referral],
        organization_referred_to: [this.referrals?.organization_referred_to],
        received_feedback: [this.referrals?.received_feedback],
        feedback_given: [this.referrals?.feedback_given],
        date_of_feedback: [this.datePipe.transform(this.referrals.date_of_feedback, 'yyyy-MM-dd')],
        nationality_status: [this.referrals?.nationality_status],
        followup_needed: [this.referrals?.followup_needed],
        followup_areas: [this.referrals?.followup_areas],
        followup_organization: [this.referrals?.followup_organization],
        disability: [this.referrals?.disability],
        status: ['Actioned'],
      });
    })

  }

  actionReferral() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const submitData = this.formGroup.value;
    console.log(submitData)
    this.referralsService.updateReferral(this.route.snapshot.params.id, submitData).subscribe((result) => {
      console.warn(result, 'Referral Updated Successfully');
      this.alertService.success(`Referral has been successfully updated`)
      this.router.navigate(['/referrals-list']);
    }, error => {
      this.alertService.error(`Failed to update Referral`)
    });
  }
  close(){
    this.router.navigate(['/referrals-list'])
  }

  onChangeCountry(event) {
    console.log(event, "nationality")
    if (!event) {
      this.nationalityValue = ''
      document.getElementById('country_of_origin').hidden = true
      this.formGroup.controls['country_of_origin'].reset();
    } else {
      this.nationalityValue = event;
      if(this.nationalityValue === "National"){
        document.getElementById('country_of_origin').hidden = true
      } else {
        document.getElementById('country_of_origin').hidden = false
      }

    }
  }

  onChangeFollowUp(event) {
    console.log(event, "nationality")
    if (!event) {
      this.followUpValue = ''
      document.getElementById('followup_areas').hidden = true
      document.getElementById('followup_organization').hidden = true
      this.formGroup.controls['followup_areas'].reset();
      this.formGroup.controls['followup_organization'].reset();
    } else {
      this.followUpValue = event;
      if(this.followUpValue === "No"){
        document.getElementById('followup_areas').hidden = true
        document.getElementById('followup_organization').hidden = true
        this.formGroup.controls['followup_areas'].reset();
        this.formGroup.controls['followup_organization'].reset();
      } else {
        document.getElementById('followup_areas').hidden = false
        document.getElementById('followup_organization').hidden = false
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



}
