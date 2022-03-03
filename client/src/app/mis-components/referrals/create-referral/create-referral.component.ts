import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {UsersService} from "../../../services/users.service";
import {AlertService} from "../../../services/alert";
import {GroupsService} from "../../../services/groups.service";
import {ReferralsService} from "../../../services/referrals.service";
import {CountriesService} from "../../../services/countries.service";


@Component({
  selector: 'app-createReferral',
  templateUrl: './create-referral.component.html',
  styleUrls: ['./create-referral.component.scss']
})
export class CreateReferralComponent implements OnInit {
  private nationalityValue = '';

  constructor(
    private userService: UsersService,
    private CountriesService: CountriesService,
    private referralsService: ReferralsService,
    private groupsService: GroupsService,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  clicked = false;
  currentDashboards: any
  formGroup: FormGroup
  submitted = false;
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
    this.formGroup = this.formBuilder.group({
      date_of_referral: [''],
      name_of_referring_officer: [''],
      name_of_client_being_referred: [''],
      phone_number: [''],
      date_of_birth: [''],
      age_category: [null],
      country_of_origin: [null],
      identification_document: [null],
      identification_number: [],
      reason_for_referral: [null],
      nationality_status: [null],
      organization_referred_to: [null],
      disability: [''],
      status: ['Pending'],
    });
  }

  createReferral() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const formData = this.formGroup.value;
    console.log(formData, "submitted data")
    this.referralsService.createReferral(formData).subscribe((result) => {
      this.alertService.success(`Referral is created successfully`);
      this.router.navigate(['/referrals-list']);
    }, error => {
      this.alertService.error("Failed to Create Referral")
    });
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

  resetForm() {
    this.formGroup.reset()
    this.clicked = false
    this.submitted = false
  }

}
