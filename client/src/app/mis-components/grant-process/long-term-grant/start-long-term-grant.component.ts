import {Component, OnInit} from '@angular/core';
import {GrantProcessService} from "../../../services/grant-process.service";
import {TempDataService} from "../../../services/temp-data.service";
import {AlertService} from "../../../services/alert";

@Component({
  selector: 'start-long-term-grant',
  templateUrl: './start-long-term-grant.component.html',
  styleUrls: ['../grant-process.component.css']
})

export class StartLongTermGrantComponent implements OnInit {
  grantId: string;
  grantList: any = [];

  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;

  constructor(
    private grantProcessService: GrantProcessService,
    private tempDataService: TempDataService,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.grantProcessService.getAllLetterOfInterest().subscribe((data: any) => {
      if (data != null) {
        data.forEach((it) => {
          if (it.status == "started") this.grantList.push(it.id)
        })
      }
    })
  }

  triggerStartInstances(grantId) {
    this.tempDataService.startLongTermGrantJob(grantId).subscribe(resp => {
      this.error = false;
      this.success = true;
      this.successMessage = resp[0];
      this.alertService.success(this.successMessage);
    }, error => {
      this.error = true;
      this.success = false;
      console.log(error);
      this.errorMessage = "Failed to start instance"
      this.alertService.success(this.successMessage);
    })
    setTimeout(() => {
      if (this.success == true) {
        window.location.reload();
      }
      this.success = false;
      this.error = false;
    }, 3000);
  }
}
