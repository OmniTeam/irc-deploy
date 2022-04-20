import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../services/alert";
import {ProjectMilestoneService} from "../../services/project-milestone.service";

@Component({
  selector: 'app-project-milestones',
  templateUrl: './project-milestones.component.html',
  styleUrls: ['./project-milestones.component.css']
})
export class ProjectMilestonesComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  groupId = '';
  search = '';
  groups;
  private searchValue = '';
  milestones: any
  submitted = false;
  activeRow: any;
  rows: Object[];
  temp: Object[];
  constructor(private route: ActivatedRoute,
              private router: Router,
              private alertService: AlertService,
              private projectMilestoneService: ProjectMilestoneService) { }

  ngOnInit(): void {
    this.reloadTable();
  }
  reloadTable() {
    this.projectMilestoneService.getMilestones().subscribe((data) => {
      this.temp = [...data];
      this.rows = data;
    });
  }

  createMilestone() {
    this.router.navigate(['/milestones/create/']);
  }

  editMilestone(row) {
    const id = row.id;
    this.router.navigate(['/milestones/edit/'+ id]);
  }

  deleteMilestone(row) {
    const deletedRow = row.id;
    if (confirm('Are you sure to delete this Milestone?')) {
      this.projectMilestoneService.deleteMilestone(deletedRow).subscribe((result) => {
          this.alertService.warning(`Milestone has been  deleted `);
          this.router.navigate(['/milestones']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Milestone could not be deleted`);
        }
      );
    }
  }

  entriesChange($event) {
    this.entries = $event.target.value;
    this.reloadTable();
  }

  filterTable($event) {
    this.search = $event.target.value;
    this.reloadTable();
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  onChangeSearch(event) {
    let val = event.target.value.toLowerCase();
    // update the rows
    this.rows = this.temp.filter(function (d) {
      for (const key in d) {
        if (d[key]?.toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  onSearch(event) {
    this.reloadTable();
  }

}
