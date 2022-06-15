import { Component, OnInit } from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskListService} from "../../../services/task-list.service";
import {AlertService} from "../../../services/alert";
import {TempDataService} from "../../../services/temp-data.service";
import {LongTermGrantService} from "../../../services/long-term-grant-service";

@Component({
  selector: 'app-long-term-grant',
  templateUrl: './long-term-grant.component.html',
  styleUrls: ['../grant-process.component.css']
})
export class LongTermGrantComponent implements OnInit {
  isApplication: boolean;
  isReviewApplication: boolean;

  taskRecord: any;
  grantId: string;
  definitionKey: string;
  processInstanceId: string;

  isReadOnly: boolean;
  reviewerComments: any;
  items = [
    {name: 'Yes', value: 'Yes'},
    {name: 'No', value: 'No'}
  ];
  decision = [
    {name: 'Proceed with application', value: 'Yes'},
    {name: 'Unsuccessful', value: 'No'}
  ];
  success: boolean;
  error: boolean;
  successMessage: string;
  errorMessage: string;
  decisionOfReviewProcess: any;
  areTheyAdhering: any;
  doesItAdhere: any;
  isConceptInline: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskListService: TaskListService,
    private alertService:AlertService,
    private tempDataService:TempDataService,
    private longTermGrantService:LongTermGrantService,
  ) { }

  ngOnInit(): void {
    this.isApplication = false;
    this.isReviewApplication = false;
    this.grantId = "3a126943-dece-46df-9799-35d720c15693"

    this.route.params
      .subscribe(p => {
        this.isReadOnly = p['readonly'] == 'true';

        if (p['id'] != undefined) {
          const params = new HttpParams().set('id', p['id']);
          this.taskListService.getTaskRecord(params).subscribe((data) => {
            this.setData(data)
          }, (error) => {
            this.taskListService.getArchivedRecord(params).subscribe((data) => {
              console.log(data);
              this.setData(data);
            }, error => console.log(error));
          });
        } else {
          this.isApplication = true
        }
      });
  }

  statusChangedHandler(status: string) {
    console.log('status', status);
    this.taskRecord.status = status
    this.taskListService.updateTask(this.taskRecord, this.taskRecord.id).subscribe((data) => {
      console.log('successfully Submitted task');
    }, error => console.log('submit task', error));
  }

  setData(data) {
    this.taskRecord = data
    if (data.taskDefinitionKey === "Application") {
      this.isApplication = true;
    }
    if (data.taskDefinitionKey === "Review") {
      this.isReviewApplication = true;
    }

    this.grantId = data.grantId;
    this.definitionKey = data.taskDefinitionKey
    this.processInstanceId = data.processInstanceId
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  submit(key, status) {
    switch (key) {
      case 'reviewApplication':
        this.submitReviewApplication(status)
        break
    }

    setTimeout(() => {
      if (status != "draft" && this.success) this.router.navigate(['/home']);
      this.success = false;
      this.error = false;
    }, 3000);
  }

  submitReviewApplication(status) {
    if (this.decisionOfReviewProcess != undefined) {
      let formData: { [key: string]: string } = {
        grantId: this.grantId,
        definitionKey: this.definitionKey,
        processInstanceId: this.processInstanceId,
        status: status
      }

      let apiUrl = `${this.longTermGrantService.reviewApplication}/getByProcessInstanceId`
      const params = new HttpParams().set('id', formData.processInstanceId);
      this.longTermGrantService.getRecordByProcessInstanceId(apiUrl, params).subscribe((response: any) => {
        if (response?.results != null) {
          this.longTermGrantService.updateReviewApplication(formData, response.results.id).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Updated";
            this.taskRecord.outputVariables = '{"reviewSuccessful": "' + this.decisionOfReviewProcess + '"}'
            this.statusChangedHandler(status)
            this.alertService.success(this.successMessage);
            this.router.navigate(['/home']);
          }, error => {
            this.error = true;
            this.errorMessage = "Failed to update";
            this.alertService.error(this.errorMessage);
            this.success = false;
            console.log(error);
          });
        } else {
          this.longTermGrantService.createReviewApplication(formData).subscribe((data) => {
            console.log('response', data)
            this.error = false;
            this.success = true;
            this.successMessage = "Submitted";
            this.taskRecord.outputVariables = '{"reviewSuccessful": "' + this.decisionOfReviewProcess + '"}'
            this.statusChangedHandler(status)
            this.alertService.success(this.successMessage);
            this.router.navigate(['/home']);
          }, error => {
            this.error = true;
            this.errorMessage = "Failed to submit";
            this.alertService.error(this.errorMessage);
            this.success = false;
            console.log(error);
          });
        }
      });
    } else {
      this.alertService.error('Please fill in all required details');
      return;
    }
  }
}
