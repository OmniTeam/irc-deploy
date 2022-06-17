import {Component, OnInit} from '@angular/core';
import {GrantProcessService} from "../../../services/grant-process.service";
import {TempDataService} from "../../../services/temp-data.service";

@Component({
  selector: 'start-long-term-grant',
  templateUrl: './start-long-term-grant.component.html',
  styleUrls: ['../grant-process.component.css']
})

export class StartLongTermGrantComponent implements OnInit {
  grantId: string;
  grantList: any = [];

  constructor(
    private grantProcessService: GrantProcessService,
    private tempDataService: TempDataService
  ) {
  }

  ngOnInit(): void {
    this.grantProcessService.getAllLetterOfInterest().subscribe((data: any) => {
      console.log(data)
      if (data != null) {
        data.forEach((it) => {
          this.grantList.push(it.id)
        })
      }
    })
  }

  triggerStartInstances() {
    this.tempDataService.startLongTermGrantJob().subscribe(resp=>{
      console.log("Started long term grant",resp)
    })
  }

  onSelectGrant(event) {
    this.grantId = event
  }
}
