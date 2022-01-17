import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ProjectService} from "../../services/project.service";
import {Subject} from "rxjs";
import {Project} from "../../models/project";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  rows: Project[] = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor( private router: Router,
               private projectService: ProjectService) {
  }

  ngOnInit() {
    this.projectService.getMisProjects().subscribe(data => {
      this.rows = data;
      this.dtTrigger.next();
    }, error => console.log(error));

    this.dtOptions = {
      pagingType: "numbers",
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
      processing: true,
      responsive: true,
      dom: 'lfrtip'
    };
  }

}
