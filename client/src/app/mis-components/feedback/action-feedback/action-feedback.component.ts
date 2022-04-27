import {Component, OnInit, AfterContentInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {UsersService} from "../../../services/users.service";
import {AlertService} from "../../../services/alert";
import {CountriesService} from "../../../services/countries.service";
import {DatePipe} from "@angular/common";
import {FeedbackService} from "../../../services/feedback.service";
import {HttpParams} from "@angular/common/http";
import {TaskListService} from "../../../services/task-list.service";
import {ProgramStaffService} from "../../../services/program-staff.service";


@Component({
  selector: 'app-createReferral',
  templateUrl: './action-feedback.component.html',
  styleUrls: ['./action-feedback.component.scss']
})
export class ActionFeedbackComponent implements OnInit, AfterContentInit {
  feedback: any;
  FBROS: any;
  taskId: any;
  taskRecord: any;

  constructor(
    private userService: UsersService,
    private datePipe: DatePipe,
    private CountriesService: CountriesService,
    private feedbackService: FeedbackService,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
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
  feedback_priority = [
    {
      'name': 'Low'
    },
    {
      'name': 'Medium'
    },
    {
      'name': 'High'
    },
    {
      'name': 'Critical'
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
  in_feedback_registry = [
    {
      'name': 'Yes'
    },
    {
      'name': 'No'
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

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.params.id;
    const params = new HttpParams().set('id', this.taskId);
    this.loadProgramStaff()

    this.taskService.getTaskRecord(params).subscribe((data) =>{
      this.taskRecord = data;
      this.feedbackService.getCurrentFeedback(this.taskRecord.referralId).subscribe(data => {
        console.log(data, "referral data")

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
          projectSector: [this.feedback?.projectSector],
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
          assignee:[''],
        });

      })
    });

  }

  ngAfterContentInit(): void{
    this.feedbackService.getCurrentFeedback(this.route.snapshot.params.id).subscribe(data => {
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
    this.feedbackService.updateFeedback(this.taskRecord.referralId, submitData).subscribe((result) => {
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
    this.taskRecord.groupId = this.taskRecord.groupId ?? '';
    let followupNeeded = this.formGroup.value.actionFollowupNeeded;
    this.taskRecord.outputVariables = '{"actionedResponse": "'+ followupNeeded +'"}'
    this.taskService.updateTask(this.taskRecord, this.taskRecord.id).subscribe((data) => {
      console.log('successfully updated task');
    }, error => console.log('update task', error));
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

}
