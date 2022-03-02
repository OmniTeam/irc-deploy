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


@Component({
  selector: 'app-createReferral',
  templateUrl: './action-referral.component.html',
  styleUrls: ['./action-referral.component.scss']
})
export class ActionReferralComponent implements OnInit {
  private referrals: any;
  private allReferrals: any;

  constructor(
    private userService: UsersService,
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
    this.referralsService.getReferrals().subscribe(data => {
      this.allReferrals = data
      this.referrals = this.allReferrals[0]
      this.formGroup = this.formBuilder.group({
        date_of_referral: [this.referrals?.date_of_referral],
        name_of_referring_officer: [this.referrals?.name_of_referring_officer],
        name_of_client_being_referred: [this.referrals?.name_of_client_being_referred],
        phone_number: [this.referrals?.phone_number],
        date_of_birth: [this.referrals?.date_of_birth],
        age_category: [this.referrals?.age_category],
        country_of_origin: [this.referrals?.country_of_origin],
        identification_document: [this.referrals?.identification_document],
        identification_number: [this.referrals?.identification_number],
        reason_for_referral: [this.referrals?.reason_for_referral],
        organization_referred_to: [this.referrals?.organization_referred_to],
        received_feedback: [this.referrals?.received_feedback],
        feedback_given: [this.referrals?.feedback_given],
        date_of_feedback: [this.referrals?.date_of_feedback],
        disability: [this.referrals?.disability],
        status: [this.referrals?.status],
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
      this.router.navigate(['/referrals']);
    }, error => {
      this.alertService.error(`Failed to update Referral`)
    });
  }



}
