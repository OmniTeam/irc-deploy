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
import {ClientService} from "../../../services/client.service";


@Component({
  selector: 'app-createReferral',
  templateUrl: './create-referral.component.html',
  styleUrls: ['./create-referral.component.scss']
})
export class CreateReferralComponent implements OnInit {
   nationalityValue = '';

  constructor(
    private userService: UsersService,
    private CountriesService: CountriesService,
    private clientService: ClientService,
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
  register_status = [
    {
      'name': 'Yes'
    },
    {
      'name': 'No'
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
  gender = [
    {
      'name': 'Male'
    },
    {
      'name': 'Female'
    }
  ];
  district_list = [
    {
      'name': 'Kampala'
    },
    {
      'name': 'Mukono'
    },
    {
      'name': 'Wakiso'
    },
    {
      'name': 'Entebbe'
    },
    {
      'name': 'Mbale'
    },
    {
      'name': 'Mbarara'
    },
  ];

  division_list = [
    {
      'name': 'Rubaga'
    },
    {
      'name': 'Makindye'
    },
    {
      'name': 'Central'
    }
  ];

  parish_list = [
    {
      'name': 'Rubaga'
    },
    {
      'name': 'Makindye'
    },
    {
      'name': 'Central'
    }
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
      dateOfRegistration: [''],
      caseId: [''],
      partnerName: [''],
      ageCategory: [null],
      countryOfOrigin: [null],
      identificationDocument: [null],
      identificationNumber: [null],
      nationality: [null],
      district: [null],
      division: [null],
      parish: [null],
      gender: [null],
      disability: [''],
      registerStatus: [''],
    });
  }

  createClient() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const formData = this.formGroup.value;
    console.log(formData, "submitted data")
    this.clientService.createClient(formData).subscribe((result) => {
      this.alertService.success(`Client is created successfully`);
      this.router.navigate(['/referrals-list']);
    }, error => {
      this.alertService.error("Failed to Create Client")
    });
  }

  onChangeCountry(event) {
    console.log(event, "nationality")
    if (!event) {
      this.nationalityValue = ''
      document.getElementById('country_of_origin').hidden = true
      this.formGroup.controls['countryOfOrigin'].reset();
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
