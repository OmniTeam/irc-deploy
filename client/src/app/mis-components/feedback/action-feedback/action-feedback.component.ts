import {Component, OnInit} from '@angular/core';
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


@Component({
  selector: 'app-createReferral',
  templateUrl: './action-feedback.component.html',
  styleUrls: ['./action-feedback.component.scss']
})
export class ActionFeedbackComponent implements OnInit {
  private feedback: any;
  private nationalityValue='';
  private followUpValue = '';

  constructor(
    private userService: UsersService,
    private datePipe: DatePipe,
    private CountriesService: CountriesService,
    private feedbackService: FeedbackService,
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

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.feedbackService.getCurrentFeedback(this.route.snapshot.params.id).subscribe(data => {
      console.log(data,"referral data")

      this.feedback = data
      let myDate = this.datePipe.transform(this.feedback.date_of_referral, 'dd-MM-yyyy')
      console.log(myDate," this is the date formatted")
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
    this.feedbackService.updateFeedback(this.route.snapshot.params.id, submitData).subscribe((result) => {
      console.warn(result, 'Feedback Updated Successfully');
      this.alertService.success(`Feedback has been successfully updated`)
      this.router.navigate(['/feedback-list']);
    }, error => {
      this.alertService.error(`Failed to update feedback`)
    });
  }
  close(){
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



}
