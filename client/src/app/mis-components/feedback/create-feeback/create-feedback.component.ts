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
   nationalityValue: '';
   country_of_origin: any;

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

  followup_response = [
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
  underReview: string;

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.CountriesService.getCountries().subscribe(data => {
      this.country_of_origin = data
    }, error => {
      this.alertService.error("Failed to get Countries")
    })
    this.loadProgramStaff();
    this.formGroup = this.formBuilder.group({
      dateFeedbackReceived: [''],
      nameOfRegister: [''],
      staffDesignation: [''],
      typeOfFeedback: [''],
      currentStatusOfFeedback: [''],
      location: [''],
      projectSector: [''],
      subSector: [''],
      nameOfClient: [''],
      remainAnonymous: [''],
      nationalityStatus: [''],
      clientType: [''],
      preferredChannel: [''],
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
      feedbackCategory: [''],
      feedbackPriority: [''],
      feedbackReferredShared: [''],
      feedbackInternallyExternally: [''],
      referredPersonName: [''],
      referredPersonPosition: [''],
      referredOrganization: [''],
      dateFeedbackReferredShared: [''],
      responseTypeRequired: [''],
      actionFollowupNeeded: [''],
      inFeedbackRegistry: [''],
      feedBackResponse:[''],
      dateFeedbackClient: [''],
      actionTaken: [''],
      staffProvidedResponse: [''],
      responseSummary: [''],
      supervisor: [''],
      countryOfOrigin:['Uganda'],
      dataEntryFocalPoint: [''],
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
    if(this.underReview != undefined) this.formGroup.get('assignee').setValue(this.underReview)

    //create a referral
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
      phoneNumber: formData.phoneNumber,
      countryOfOrigin: formData.countryOfOrigin,
      disability: formData.disability

    }
    //create feedback
    let statusSave:string = formData.currentStatusOfFeedback

    let newFormData: {[key:string]: string} = {
      dateFeedbackReceived: formData.dateFeedbackReceived,
      nameOfRegister: formData.nameOfRegister,
      staffDesignation: formData.staffDesignation,
      typeOfFeedback: formData.typeOfFeedback,
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
      age: (formData.age).toString(),
      serialNumber: formData.serialNumber,
      gender: formData.gender,
      project: formData.project,
      countryOfOrigin:formData.countryOfOrigin,
      currentStatusOfFeedback: formData.currentStatusOfFeedback,
      assignee: formData.assignee,
      feedbackDetails: formData.feedbackDetails,
      nameOfReferringOfficer: formData.nameOfReferringOfficer,
      reasonForReferral: formData.reasonForReferral,
      organizationReferredTo: formData.organizationReferredTo,
      followupNeeded: formData.followupNeeded,
      feedbackCategory: formData.feedbackCategory,
      feedbackPriority: formData.feedbackPriority,
      feedbackReferredShared: formData.feedbackReferredShared,
      feedbackInternallyExternally: formData.feedbackInternallyExternally,
      referredPersonName: formData.referredPersonName,
      referredPersonPosition: formData.referredPersonPosition,
      referredOrganization: formData.referredOrganization,
      dateFeedbackReferredShared: formData.dateFeedbackReferredShared,
      responseTypeRequired: formData.responseTypeRequired,
      actionFollowupNeeded: formData.actionFollowupNeeded,
      inFeedbackRegistry: formData.inFeedbackRegistry,
      dateFeedbackClient: formData.dateFeedbackClient,
      actionTaken: formData.actionTaken,
      staffProvidedResponse: formData.staffProvidedResponse,
      responseSummary: formData.responseSummary,
      supervisor: formData.supervisor,
      dataEntryFocalPoint: formData.dataEntryFocalPoint,

    }
    console.log(formData, "submitted data")
    if(formData.currentStatusOfFeedback == 'Referral'){

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
      document.getElementById("age").hidden = true
      document.getElementById("gender").hidden = true
      document.getElementById("nationality").hidden = true
      document.getElementById("disability").hidden = true
    } else {
      document.getElementById('detailsForUser').hidden = false
      document.getElementById('detailsForAnonUser').hidden = true
      document.getElementById("age").hidden = false
      document.getElementById("gender").hidden = false
      document.getElementById("nationality").hidden = false
      document.getElementById("disability").hidden = false
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


  chooseActionForFeedback(event) {
    if (event === 'Forwarded For Action') {
      document.getElementById("assignee").hidden = false

      document.getElementById("actionDetails").hidden = true
      document.getElementById("referral").hidden = true

    } else if(event === 'Actioned') {

      document.getElementById('actionDetails').hidden = false
      document.getElementById('assignee').hidden = true
      document.getElementById('referral').hidden = true

    } else if(event === 'Referral') {
      document.getElementById('loop').hidden = true
      document.getElementById('actionDetails').hidden = true
      document.getElementById('assignee').hidden = true
      document.getElementById('referral').hidden = false

    } else if(event === 'Under Review' ) {

      document.getElementById('actionDetails').hidden = true
      document.getElementById('assignee').hidden = true
      document.getElementById('referral').hidden = true
      this.underReview =  this.authService.getLoggedInUsername()
    } else {

      document.getElementById('actionDetails').hidden = true
      document.getElementById('assignee').hidden = true
      document.getElementById('referral').hidden = true
    }
  }

  /*Save feedback for later*/

  saveForm() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const formData = this.formGroup.value;
    if(this.underReview != undefined) this.formGroup.get('assignee').setValue(this.underReview)

    let submitData: {[key:string]: string} = {
      dateOfReferral: formData.dateFeedbackReceived,
      nameOfReferringOfficer: formData.nameOfReferringOfficer,
      reasonForReferral: formData.reasonForReferral,
      organizationReferredTo: formData.organizationReferredTo,
      followupNeeded: formData.followupNeeded,
      status: 'Saved',
      nameOfClientBeingReferred: formData.nameOfClient,
      gender: formData.gender,
      ageCategory: formData.age,
      nationalityStatus: formData.nationalityStatus,
      assignee: formData.assignee,
      phoneNumber: formData.phoneNumber,
      countryOfOrigin: formData.countryOfOrigin,
      disability: formData.disability

    }

    let statusSave = 'Saved'
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
      feedbackCategory: formData.feedbackCategory,
      feedbackPriority: formData.feedbackPriority,
      countryOfOrigin:formData.countryOfOrigin,
      feedbackReferredShared: formData.feedbackReferredShared,
      feedbackInternallyExternally: formData.feedbackInternallyExternally,
      referredPersonName: formData.referredPersonName,
      referredPersonPosition: formData.referredPersonPosition,
      referredOrganization: formData.referredOrganization,
      dateFeedbackReferredShared: formData.dateFeedbackReferredShared,
      responseTypeRequired: formData.responseTypeRequired,
      actionFollowupNeeded: formData.actionFollowupNeeded,
      inFeedbackRegistry: formData.inFeedbackRegistry,
      dateFeedbackClient: formData.dateFeedbackClient,
      actionTaken: formData.actionTaken,
      staffProvidedResponse: formData.staffProvidedResponse,
      responseSummary: formData.responseSummary,
      supervisor: formData.supervisor,
      dataEntryFocalPoint: formData.dataEntryFocalPoint,
      status: 'Saved'
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


    onChangeCountry(event) {
      document.getElementById("country_of_origin").hidden = event == "National";
  }

  checkForFeedBackResponse(event) {
    document.getElementById("loop").hidden = event == "No";
  }

}
