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
    private referralsService: ReferralsService,
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
  updateStatus: any;

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
  action_taken = [
    {
      'name': 'Apology Sent'
    },
    {
      'name': 'Corrective decision taken'
    },
    {
      'name': 'Dropped'
    },
    {
      'name': 'Explanation Provided'
    },
    {
      'name': 'Information Provided'
    },
    {
      'name': 'Programming change made'
    },
    {
      'name': 'Referred externally'
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
    {
      'name': 'Referral'
    }
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

  feedback_category = [
    {
      'name': 'Allegations non-IRC'
    },
    {
      'name': 'Assistance'
    },
    {
      'name': 'Information'
    },
    {
      'name': 'Minor Dissatisfaction'
    },
    {
      'name': 'Positive'
    },
  ];

  feedback_shared_referred = [
    {
      'name': 'Yes'
    },
    {
      'name': 'No'
    },
  ];

  feedback_internal_external = [
    {
      'name': 'Internally'
    },
    {
      'name': 'Externally'
    },
    {
      'name': 'I dont Know'
    },
  ];
  response_required = [
    {
      'name': 'Apology'
    },
    {
      'name': 'Change Policy'
    },
    {
      'name': 'Corrective Decision'
    },
    {
      'name': 'Explanation'
    },
    {
      'name': 'External Referral'
    },
    {
      'name': 'Goods/Services'
    },
    {
      'name': 'Information'
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
  referralDecisionPoint: any;

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
      nameOfReferringOfficer:[''],
      reasonForReferral:[''],
      organizationReferredTo:[''],
      followupNeeded:[''],
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
    formData.status = this.updateStatus
    let submitData: {[key:string]: string} = {
      dateOfReferral: formData.dateFeedbackReceived,
      nameOfReferringOfficer: formData.nameOfReferringOfficer,
      reasonForReferral: formData.reasonForReferral,
      organizationReferredTo: formData.organizationReferredTo,
      followupNeeded: formData.followupNeeded,
      status: 'Pending',
      nameOfClientBeingReferred: formData.nameOfClient,
      gender: formData.gender,
      ageCategory: formData.age,
      nationalityStatus: formData.nationalityStatus,
      assignee: formData.assignee,
      phoneNumber: formData.phoneNumber

    }

    let statusSave = 'Actioned'
    let newFormData: {[key:string]: string} = {
      dateFeedbackReceived: formData.dateFeedbackReceived,
      nameOfRegister: formData.nameOfRegister,
      staffDesignation: formData.staffDesignation,
      typeOfFeedback: formData.typeOfFeedback,
      currentStatusOfFeedback: formData.currentStatusOfFeedback,
      location: formData.location,
      projectSector: formData.projectSector,
      subSector: formData.subSector,
      nameOfClient: formData.nameOfClient,
      remainAnonymous: formData.remainAnonymous,
      nationalityStatus: formData.nationalityStatus,
      clientType: formData.clientType,
      preferredChannel: formData.preferredChannel,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      age: formData.age,
      serialNumber: formData.serialNumber,
      gender: formData.gender,
      project: formData.project,
      assignee: formData.assignee,
      feedbackDetails: formData.feedbackDetails,
      nameOfReferringOfficer: formData.nameOfReferringOfficer,
      reasonForReferral: formData.reasonForReferral,
      organizationReferredTo: formData.organizationReferredTo,
      followupNeeded: formData.followupNeeded,
      status: statusSave
    }
    console.log(formData, "submitted data")
    if(this.referralDecisionPoint == 'Referral'){

      console.log("Feedback",newFormData);
      /** save feedback */
      this.feedbackService.createFeedback(newFormData).subscribe((result) => {
        this.alertService.success(`feedback is created successfully`);
        this.router.navigate(['/feedback-list']);
      }, error => {
        this.alertService.error("Failed to Create feedback")
      });
        /** save referral */
      this.referralsService.createReferral(submitData).subscribe((result) => {
        console.warn(result, 'Referral Created Successfully');
        this.alertService.success(`Referral has been successfully created`)
        // this.router.navigate(['/referrals-list']);
      }, error => {
        this.alertService.error(`Failed to create Referral`)
      });
    } else {

      this.feedbackService.createFeedback(formData).subscribe((result) => {
        this.alertService.success(`feedback is created successfully`);
        this.router.navigate(['/feedback-list']);
      }, error => {
        this.alertService.error("Failed to Create feedback")
      });
    }

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

  checkForAnonStatus(event) {
    if (event === 'Yes') {
      document.getElementById("detailsForUser").hidden = true
      document.getElementById("detailsForAnonUser").hidden = false
    } else {
      document.getElementById('detailsForUser').hidden = false
      document.getElementById('detailsForAnonUser').hidden = true
    }
  }

  changeChannelPreferred(event) {
    if (event === 'Email Address') {
      document.getElementById("phone").hidden = true
      document.getElementById("email").hidden = false
    } else {
      document.getElementById('phone').hidden = false
      document.getElementById('email').hidden = true
    }
  }

  //TODO add save functionality

  chooseActionForFeedback(event) {
    if (event === 'Forwarded For Action') {
      document.getElementById("assignee").hidden = false
      document.getElementById("loop").hidden = true
      document.getElementById("actionDetails").hidden = true
      document.getElementById("referral").hidden = true
    } else if(event === 'Actioned') {
      document.getElementById('loop').hidden = false
      document.getElementById('actionDetails').hidden = false
      document.getElementById('assignee').hidden = true
      document.getElementById('referral').hidden = true
    } else if(event === 'Referral') {
      document.getElementById('loop').hidden = true
      document.getElementById('actionDetails').hidden = true
      document.getElementById('assignee').hidden = true
      document.getElementById('referral').hidden = false
    }
  }
}
