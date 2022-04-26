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
import {FeedbackService} from "../../../services/feedback.service";
import {ProgramStaffService} from "../../../services/program-staff.service";


@Component({
  selector: 'app-createFeedback',
  templateUrl: './create-feedback.component.html',
  styleUrls: ['./create-feedback.component.scss']
})
export class CreateFeedbackComponent implements OnInit {

  constructor(
    private userService: UsersService,
    private CountriesService: CountriesService,
    private feedbackService: FeedbackService,
    private groupsService: GroupsService,
    private alertService: AlertService,
    private programStaff: ProgramStaffService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  clicked = false;
  currentDashboards: any
  formGroup: FormGroup
  submitted = false;
  staffs: any

  staff_Designation =[
    {
      'name': 'AAP Officer'
    },
    {
      'name': 'CCEO'
    },
    {
      'name': 'Monitoring & Evaluation Officer'
    },
    {
      'name': 'Program Staff'
    },
  ];
  type_of_feedback = [
    {
      'name': 'Old'
    },
    {
      'name': 'New'
    },
  ];
  feedback_status = [
    {
      'name': 'Actioned'
    },
    {
      'name': 'Under Review'
    },
    {
      'name': 'No Actioned Required'
    },
    {
      'name': 'Forwarded For Action'
    },
  ];
  location = [
    {
      'name': 'Kampala Office'
    },
    {
      'name': 'Gulu Office'
    },
    {
      'name': 'Hoima Office'
    },
  ];
  project_status = [
    {
      'name': 'SAFETY (wpe)'
    },
    {
      'name': 'HEALTH'
    },
    {
      'name': 'ERD'
    },
    {
      'name': 'EDUCATION'
    },
    {
      'name': 'PROTECTION (prol)'
    },
    {
      'name': 'No sector related'
    },
  ];
  remain_anonymous = [
    {
      'name': 'Yes'
    },
    {
      'name': 'No'
    },
    {
      'name': 'Not Sure'
    },
  ];
  gender = [
    {
      'name': 'Female'
    },
    {
      'name': 'Male'
    },
    {
      'name': 'Not Disclosed'
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
  type_of_client = [
    {
      'name': 'Direct'
    },
    {
      'name': 'Indirect Client'
    },
    {
      'name': 'Intended'
    },
    {
      'name': 'Other'
    },
  ];
  preferred_channel = [
    {
      'name': 'Client Forum'
    },
    {
      'name': 'Collectively with Community'
    },
    {
      'name': 'Email Address'
    },
    {
      'name': 'In Person'
    },
    {
      'name': 'In Person'
    },
    {
      'name': 'Phone Call'
    },
    {
      'name': 'SMS'
    },
    {
      'name': 'Stakeholders Reference Group'
    },
    {
      'name': 'Through a Third Party'
    },
    {
      'name': 'Via IRC Staff'
    },
    {
      'name': 'Other'
    },
  ];
  gender_list = [
    {
      'name': 'Male'
    },
    {
      'name': 'Female'
    },
    {
      'name': 'Not disclosed'
    },
  ];


  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.loadProgramStaff();
    this.formGroup = this.formBuilder.group({
      dateFeedbackReceived: [''],
      nameOfRegister: [''],
      staffDesignation: [null],
      typeOfFeedback: [null],
      currentStatusOfFeedback: [null],
      location: [null],
      projectSector: [null],
      subSector: [null],
      nameOfClient: [],
      remainAnonymous: [null],
      nationalityStatus: [null],
      clientType: [null],
      preferredChannel: [null],
      phoneNumber: [''],
      email:[''],
      age:[''],
      serialNumber:[''],
      gender:[''],
      project:[''],
      assignee:[''],
      feedbackDetails:[''],
      status:['Pending']
    });
  }

  createFeedback() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const formData = this.formGroup.value;
    console.log(formData, "submitted data")
    this.feedbackService.createFeedback(formData).subscribe((result) => {
      this.alertService.success(`feedback is created successfully`);
      this.router.navigate(['/feedback-list']);
    }, error => {
      this.alertService.error("Failed to Create feedback")
    });
  }


  resetForm() {
    this.formGroup.reset()
    this.clicked = false
    this.submitted = false
  }

  loadProgramStaff(){
    this.userService.getUsers().subscribe((data) => {
      this.staffs = data;
      console.log(data)
    });
  }

}
