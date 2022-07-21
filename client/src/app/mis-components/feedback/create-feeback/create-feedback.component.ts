import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup, Validators
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
   registra: any;


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
  selectedStaff: any;
  updateStatus: any;


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
    {'name':'Domestic violence'},
    {'name':'Rape cases'},
    {'name':'Missing drugs'},
    {'name':'Child abuse'},
    {'name':'Lost documents'},
    {'name':'Missed food'},
    {'name':'Defilement'},
    {'name':'Forced marriage'},
    {'name':'Child marriage'},
    {'name':'Missed cash support'},
    {'name': 'Others'}
  ];

  priority_of_feedback = [
    {'name':'Critical'},
    {'name':'High'},
    {'name':'Low'},
    {'name':'Medium'},
  ]
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
      'name': 'Kampala'
    },
    {
      'name': 'WestNile'
    },
    {
      'name': 'Northern'
    },
    {
      'name': 'Southwest'
    },
    {
      'name': 'Karamoja'
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

  disability_status = [
    {
      'name': 'Physical disability'
    },
    {
      'name': 'Visual Impairment'
    },
    {
      'name': 'Hearing Impairment'
    },
    {
      'name': 'Speech Impairment'
    },
    {
      'name': 'Mental Disability'
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
      'name' : 'National'
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
      'name': 'Age Gender Diversity(AGD)'
    },
    {
      'name': 'Bodaboda Talk Talk (BBTT)'
    },
    {
      'name': 'Client Responsiveness Survey'
    },
    {
      'name': 'Community Meetings Or Dialogues'
    },
    {
      'name': 'Email (ADDRESS)'
    },
    {
      'name': 'Focus Group Discussion'
    },
    {
      'name': 'Individual Interview'
    },
    {
      'name': 'Information Support Centers (Help Desk)'
    },
    {
      'name': 'Office Walk-In'
    },
    {
      'name': 'Suggestion Box'
    },{
      'name': 'Telephone (NUMBER)'
    },{
      'name': 'Through Community Leaders'
    },{
      'name': 'Through IRC Staff And Volunteers'
    },{
      'name': 'Whatsapp'
    },{
      'name': 'Women And Girl Centres'
    },{
      'name': 'Other'
    },
  ];

  country_origin = [
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
      'name': 'Other'
    },
  ];

  district_list: any;

  district_kla = [
    {
      'name': 'Kampala'
    },
  ];

  district_westNile = [
    {
      'name': 'Yumbe'
    },
    {
      'name': 'Madi Okollo'
    },
    {
      'name': 'Terego'
    }
  ];

  district_north = [
    {
      'name': 'Kiryandongo'
    },
    {
      'name': 'Lamwo'
    }
  ];

  district_karamoja = [
    {
      'name': 'Moroto'
    },
    {
      'name': 'Napak'
    },
    {
      'name': 'Nakapiripirit'
    },
    {
      'name': 'Amudat'
    },
    {
      'name': 'Kotido'
    },
    {
      'name': 'Abim'
    },{
      'name': 'Kaabong'
    }
  ];

  district_southwest = [
   {
      'name': 'Kyegeggwa'
    },
  ];

  project_sites :any
  project_site_kla = [
    {
      'name': 'Kampala Urban'
    },
  ];

  project_sites_west = [

    {
      'name': 'Bidi bidi'
    },
    {
      'name': 'Rhino'
    },
    {
      'name': 'Imvepi'
    },
  ];

  project_sites_north = [
    {
      'name': 'Kiryandongo'
    },
    {
      'name': 'Lamwo'
    },
  ];

  project_sites_karamoja = [

    {
      'name': 'Moroto'
    },
    {
      'name': 'Napak'
    },
    {
      'name': 'Nakapiripirit'
    },
    {
      'name': 'Amudat'
    },
    {
      'name': 'Kotido'
    },
    {
      'name': 'Abim'
    },{
      'name': 'Kaabong'
    }
  ];

  project_sites_south = [
    {
      'name': 'Kyaka'
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

  irc_list = [
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
  referralDecisionPoint: any;
  underReview: string;
  staffId: any;

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
      dateFeedbackReceived: ['',[Validators.required]],
      nameOfRegister: [''],
      staffDesignation: [''],
      typeOfFeedback: [''],
      currentStatusOfFeedback: ['', [Validators.required]],
      location: ['', [Validators.required]],
      district: ['', [Validators.required]],
      projectSite:[''],
      projectSector: [''],
      subSector: [''],
      nameOfClient: [''],
      remainAnonymous: ['', [Validators.required]],
      nationalityStatus: [''],
      clientType: [''],
      preferredChannel: ['', [Validators.required]],
      phoneNumber: ['',[Validators.minLength(9)]],
      email:['', [Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      age:[''],
      serialNumber:[''],
      gender:[''],
      project:[''],
      assignee:[''],
      disability:[''],
      feedbackDetails:[''],
      nameOfReferringOfficer:[''],
      reasonForReferral:[''],
      organizationReferredTo:[''],
      ircReferredTo:[''],
      referredPerson:[''],
      responseType:[''],
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

    var newFormData: {[key:string]: string} = {
      dateFeedbackReceived: formData.dateFeedbackReceived,
      nameOfRegister: this.registra,
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
      district: formData.district,
      projectSite: formData.projectSite,
      ircReferredTo:formData.ircReferredTo,
      referredPerson:formData.referredPerson,
      responseType: formData.responseType,
      countryOfOrigin:formData.countryOfOrigin,
      disability: formData.disability,
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
        this.router.navigate(['/irc-feedback-list']);
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
      this.feedbackService.createFeedback(newFormData).subscribe((result) => {
        this.alertService.success(`feedback is created successfully`);
        this.router.navigate(['/irc-feedback-list']);
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

  getDesignation() {
    let staffId = this.staffId;
    this.userService.getCurrentUser(staffId).subscribe(data => {
      this.selectedStaff = data
      this.registra = this.selectedStaff.names
      this.formGroup.get('staffDesignation').setValue(this.selectedStaff.designation)
      // this.formGroup.value('nameOfRegister').append(this.registra)
      // this.formGroup.get('nameOfRegister').setValue(this.registra)
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
    if (event === 'Email (ADDRESS)') {
      document.getElementById("phone").hidden = true
      document.getElementById("email").hidden = false
    } else if(event === 'Telephone (NUMBER)' || event === 'Whatsapp'){
      document.getElementById('phone').hidden = false
      document.getElementById('email').hidden = true
    } else {
      document.getElementById('phone').hidden = true
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
      document.getElementById('loop').hidden = true
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


    var newFormData: {[key:string]: string} = {
      dateFeedbackReceived: formData.dateFeedbackReceived,
      nameOfRegister: this.registra,
      staffDesignation:  formData.staffDesignation,
      typeOfFeedback: formData.typeOfFeedback,
      currentStatusOfFeedback: formData.currentStatusOfFeedback,
      location: formData.location,
      district: formData.district,
      projectSite: formData.projectSite,
      ircReferredTo:formData.ircReferredTo,
      referredPerson:formData.referredPerson,
      responseType: formData.responseType,
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
      disability: formData.disability,
      dataEntryFocalPoint: formData.dataEntryFocalPoint,
      status: 'Saved'
    }
    console.log(formData, "submitted data")
    if(this.referralDecisionPoint == 'Referral'){

      console.log("Feedback",newFormData);
      /** save feedback */
      this.feedbackService.createFeedback(newFormData).subscribe((result) => {
        this.alertService.success(`feedback is created successfully`);
        this.router.navigate(['/irc-feedback-list']);
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

      this.feedbackService.createFeedback(newFormData).subscribe((result) => {
        this.alertService.success(`feedback is created successfully`);
        this.router.navigate(['/irc-feedback-list']);
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

  disabilityQuestion(event) {
    if(event === 'Yes'){
      document.getElementById("disability").hidden = false
    } else {
      document.getElementById("disability").hidden = true
    }
  }

  feedBackSharedChange(event) {
    document.getElementById("internalExternal").hidden = event !== 'Yes';
  }

  interFeedBackCheck(event) {
    if(event === 'Internally'){
      document.getElementById("sectorName").hidden = false
      document.getElementById("personReferred").hidden = false
      document.getElementById("orgName").hidden = true
    } else {
      document.getElementById("orgName").hidden = false
      document.getElementById("personReferred").hidden = false
      document.getElementById("sectorName").hidden = true
    }
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  filterForLocation(event) {
    if(event === 'Kampala'){
      this.district_list = this.district_kla
      this.project_sites = this.project_site_kla
    } else if (event === 'WestNile'){
      this.district_list = this.district_westNile
      this.project_sites = this.project_sites_west
    } else if(event === 'Northern'){
      this.district_list = this.district_north
      this.project_sites = this.project_sites_north
    } else if(event === 'Southwest'){
      this.district_list = this.district_southwest
      this.project_sites = this.project_sites_south
    } else if(event === 'Karamoja'){
      this.district_list = this.district_karamoja
      this.project_sites = this.project_sites_karamoja
    }
  }


}
