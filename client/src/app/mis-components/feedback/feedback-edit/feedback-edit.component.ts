import {AfterContentInit, Component, OnInit} from '@angular/core';
import {UsersService} from '../../../services/users.service';
import {DatePipe} from '@angular/common';
import {FeedbackService} from '../../../services/feedback.service';
import {AlertService} from '../../../services/alert';
import {AuthService} from '../../../services/auth.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProgramStaffService} from '../../../services/program-staff.service';
import {TaskListService} from '../../../services/task-list.service';
import {HttpParams} from '@angular/common/http';
import {CountriesService} from '../../../services/countries.service';
import {ReferralsService} from '../../../services/referrals.service';

@Component({
  selector: 'app-feedback-edit',
  templateUrl: './feedback-edit.component.html',
  styleUrls: ['./feedback-edit.component.css']
})
export class FeedbackEditComponent implements OnInit,AfterContentInit {

  feedback: any;
  FBROS: any;
  feedbackId: any;
  taskRecord: any;
  district_list: any;
  underReview: string;

  constructor(
    private userService: UsersService,
    private datePipe: DatePipe,
    private CountriesService: CountriesService,
    private feedbackService: FeedbackService,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private referralsService: ReferralsService,
    private programStaff: ProgramStaffService,
    private taskService: TaskListService,
    private router: Router
  ) {
  }

  clicked = false;
  currentDashboards: any
  formGroup: FormGroup
  submitted = false;
  showDiv:boolean
  staffs: any
  followUpValue = '';
  referralDecisionPoint: any;


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
      'name': 'Ugandan'
    },
    {
      'name': 'Other'
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



  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.feedbackId = this.route.snapshot.params.id;
    const params = new HttpParams().set('id', this.feedbackId);
    this.loadProgramStaff()

      this.feedbackService.getCurrentFeedback(this.feedbackId).subscribe((data) => {
        this.feedback = data
        let myDate = this.datePipe.transform(this.feedback.date_of_referral, 'dd-MM-yyyy')
        console.log(myDate, " this is the date formatted")
        this.formGroup = this.formBuilder.group({
          dateFeedbackReceived: [(this.datePipe.transform(this.feedback.dateFeedbackReceived, 'yyyy-MM-dd'))],
          nameOfRegister: [this.feedback?.nameOfRegister],
          staffDesignation: [this.feedback?.staffDesignation],
          typeOfFeedback: [this.feedback?.typeOfFeedback],
          currentStatusOfFeedback: [this.feedback?.currentStatusOfFeedback],
          location: [this.feedback?.location],
          gender: [this.feedback?.gender],
          age: [this.feedback?.age],
          email: [this.feedback?.email],
          disability: [this.feedback?.disability],
          projectSector: [this.feedback?.projectSector],
          ircReferredTo:[this.feedback?.ircReferredTo],
          responseType: [this.feedback?.responseType],
          referredPerson:[this.feedback?.referredPerson],
          subSector: [this.feedback?.subSector],
          nameOfClient: [this.feedback?.nameOfClient],
          remainAnonymous: [this.feedback?.remainAnonymous],
          nationalityStatus: [this.feedback?.nationalityStatus],
          clientType: [this.feedback?.clientType],
          preferredChannel: [this.feedback?.preferredChannel],
          phoneNumber: [this.feedback?.phoneNumber],
          serialNumber: [this.feedback?.serialNumber],
          feedbackCategory: [this.feedback?.feedbackCategory],
          feedbackPriority: [this.feedback?.feedbackPriority],
          feedbackReferredShared: [this.feedback?.feedbackReferredShared],
          feedbackInternallyExternally: [this.feedback?.feedbackInternallyExternally],
          referredPersonName: [this.feedback?.referredPersonName],
          referredPersonPosition: [this.feedback?.referredPersonPosition],
          referredOrganization: [this.feedback?.referredOrganization],
          dateFeedbackReferredShared: [this.datePipe.transform(this.feedback?.dateFeedbackReferredShared, 'yyyy-MM-dd')],
          responseTypeRequired: [this.feedback?.responseTypeRequired],
          actionFollowupNeeded: [this.feedback?.actionFollowupNeeded],
          inFeedbackRegistry: [this.feedback?.inFeedbackRegistry],
          dateFeedbackClient: [this.datePipe.transform(this.feedback?.dateFeedbackClient, 'yyyy-MM-dd')],
          actionTaken: [this.feedback?.actionTaken],
          staffProvidedResponse: [this.feedback?.staffProvidedResponse],
          responseSummary: [this.feedback?.responseSummary],
          supervisor: [this.feedback?.supervisor],
          dataEntryFocalPoint: [this.feedback?.dataEntryFocalPoint],
          assignee:[this.feedback?.assignee],
          feedbackDetails:[this.feedback?.feedbackDetails],
          feedBackResponse:[this.feedback?.feedBackResponse],
          nameOfReferringOfficer:[this.feedback?.nameOfReferringOfficer],
          reasonForReferral:[this.feedback?.reasonForReferral],
          organizationReferredTo:[this.feedback?.organizationReferredTo],
          followupNeeded:[this.feedback?.followupNeeded],
          projectSite:[this.feedback?.projectSite],
          district:[this.feedback?.district],
          project:[this.feedback?.project],
          countryOfOrigin:[this.feedback?.countryOfOrigin]
        });

      })


  }

  ngAfterContentInit(): void{
    this.feedbackId = this.route.snapshot.params.id;
    const params = new HttpParams().set('id', this.feedbackId);
    this.taskService.getTaskRecord(params).subscribe((data) => {
      this.feedbackService.getCurrentFeedback(data.feedbackId).subscribe(data => {
        this.FBROS = data
        console.log(this.FBROS.feedbackReferredShared)
        if (this.FBROS?.feedbackReferredShared === 'Yes') {
          document.getElementById("internalExternal").hidden = false
          document.getElementById('personName').hidden = false
          document.getElementById('personPosition').hidden = false
          document.getElementById('organizationReferred').hidden = false
        } else {
          this.f['feedbackInternallyExternally'].reset()
          this.f['referredPersonName'].reset()
          this.f['referredPersonPosition'].reset()
          this.f['referredOrganization'].reset()
          document.getElementById('internalExternal').hidden = true
          document.getElementById('personName').hidden = true
          document.getElementById('personPosition').hidden = true
          document.getElementById('organizationReferred').hidden = true

        }
      })
    })
  }

  onChangeCountry(event) {
    document.getElementById("country_of_origin").hidden = event == "National";
  }

  resetForm() {
    this.formGroup.reset()
    this.clicked = false
    this.submitted = false
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
    this.feedbackService.updateFeedback(this.taskRecord.feedbackId, submitData).subscribe((result) => {
      console.warn(result, 'Feedback Updated Successfully');
      this.updateTask("completed")
      this.alertService.success(`Feedback has been successfully updated`)
      this.router.navigate(['/feedback-list']);
    }, error => {
      this.alertService.error(`Failed to update feedback`)
    });
  }

  updateTask(status){
    this.taskRecord.status = status;
    this.taskRecord.groupId = '[]';
    let followupNeeded = this.formGroup.value.actionFollowupNeeded;
    this.taskRecord.outputVariables = '{"actionedResponse": "'+ followupNeeded +'"}'
    this.taskService.updateTask(this.taskRecord, this.taskRecord.id).subscribe((data) => {
      console.log('successfully updated task');
    }, error => console.log('update task', error));
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


  close() {
    this.router.navigate(['/feedback-list'])
  }

  deleteReferral() {
    if (confirm('Are you sure to delete this feedback?')) {
      console.log(
        this.feedbackService.deleteCurrentFeedback(this.route.snapshot.params.id).subscribe((result) => {
            console.warn(result, 'feedback has been deleted');
            this.alertService.warning(`feedback has been deleted`)
            this.router.navigate(['/feedback-list']);
          }, error => {
            this.alertService.error(`Failed to delete feedback`)
          }
        ));
    }
  }

  onReferredOrShared(event) {
    if (event === 'Yes') {
      document.getElementById("internalExternal").hidden = false
      document.getElementById('personName').hidden = false
      document.getElementById('personPosition').hidden = false
      document.getElementById('organizationReferred').hidden = false
    } else {
      this.f['feedbackInternallyExternally'].reset()
      this.f['referredPersonName'].reset()
      this.f['referredPersonPosition'].reset()
      this.f['referredOrganization'].reset()
      document.getElementById('internalExternal').hidden = true
      document.getElementById('personName').hidden = true
      document.getElementById('personPosition').hidden = true
      document.getElementById('organizationReferred').hidden = true

    }

  }

  loadProgramStaff(){
    this.userService.getUsers().subscribe((data) => {
      this.staffs = data;
      console.log(data)
    });
  }


  onChangeFollowUp(event) {
    console.log(event, "nationality")
    if (!event) {
      this.followUpValue = ''
      document.getElementById('loop').hidden = false
      document.getElementById('assignee').hidden = true
      this.formGroup.controls['loop'].reset();
      this.formGroup.controls['assignee'].reset();
    } else {
      this.followUpValue = event;
      if (this.followUpValue === "No") {
        document.getElementById('loop').hidden = false
        document.getElementById('assignee').hidden = true
        this.formGroup.controls['loop'].reset();
        this.formGroup.controls['assignee'].reset();
      } else {
        document.getElementById('loop').hidden = true
        document.getElementById('assignee').hidden = false
      }

    }
  }

  feedbackSharedChoice(event) {
    if (event === 'Internally') {
      document.getElementById("sectorName").hidden = false
      document.getElementById("organizationReferred").hidden = true
    } else {
      document.getElementById('organizationReferred').hidden = false
      document.getElementById('sectorName').hidden = true
    }
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
  /*create ie submit feedbCK*/
  createFeedback() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const formData = this.formGroup.value;
    if(this.underReview != undefined) this.formGroup.get('assignee').setValue(this.underReview)

    let newFormData: {[key:string]: string} = {
      dateFeedbackReceived: formData.dateFeedbackReceived,
      nameOfRegister: formData.nameOfRegister,
      staffDesignation: formData.staffDesignation,
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
      dataEntryFocalPoint: formData.dataEntryFocalPoint,
      status: 'Saved'
    }
    console.log(formData, "submitted data")
    if(this.referralDecisionPoint != 'Referral'){

      console.log("Feedback",newFormData);
      /** save feedback */
      this.feedbackService.updateFeedback(this.feedbackId, newFormData).subscribe((result) => {
        this.alertService.success(`Feedback has been successfully updated`)
        this.router.navigate(['/feedback-list']);
      }, error => {
        this.alertService.error(`Failed to update feedback`)
      });
    } else {
      this.alertService.error("Failed to Update feedback")
    }

  }

  /*save feedback*/
  saveForm() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const formData = this.formGroup.value;
    if(this.underReview != undefined) this.formGroup.get('assignee').setValue(this.underReview)

    let newFormData: {[key:string]: string} = {
      dateFeedbackReceived: formData.dateFeedbackReceived,
      nameOfRegister: formData.nameOfRegister,
      staffDesignation: formData.staffDesignation,
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
      dataEntryFocalPoint: formData.dataEntryFocalPoint,
      status: 'Saved'
    }
    console.log(formData, "submitted data")
    if(this.referralDecisionPoint != 'Referral'){

      console.log("Feedback",newFormData);
      /** save feedback */
      this.feedbackService.updateFeedback(this.feedbackId, newFormData).subscribe((result) => {
        this.alertService.success(`Feedback has been successfully updated`)
        this.router.navigate(['/feedback-list']);
      }, error => {
        this.alertService.error(`Failed to update feedback`)
      });
    } else {
        this.alertService.error("Failed to Update feedback")
    }
  }

  feedBackSharedChange(event) {
    document.getElementById("internalExternal").hidden = event !== 'Yes';
  }


}
