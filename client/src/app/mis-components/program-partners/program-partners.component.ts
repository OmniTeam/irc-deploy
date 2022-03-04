import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../services/alert";
import {ProgramPartnersService} from "../../services/program-partners.service";

@Component({
  selector: 'app-program-partners',
  templateUrl: './program-partners.component.html',
  styleUrls: ['./program-partners.component.css']
})
export class ProgramPartnersComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  groupId = '';
  search = '';
  private searchValue = '';
  submitted = false;
  activeRow: any;
  partners: any;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private alertService: AlertService,
              private programPartnersService : ProgramPartnersService) { }

  ngOnInit(): void {
    this.reloadTable();
  }

  reloadTable() {
    this.programPartnersService.getProgramPartners().subscribe((data) => {
      console.log(data);
      this.partners = data;
    });
  }

  createProgramPartner() {
    this.router.navigate(['/programPartner/create/']);
  }

  editProgramPartner(row) {
    const id = row.id;
    this.router.navigate(['/programPartner/edit/'+ id]);
  }

  deleteProgramPartner(row) {
    const deletedRow = row.id;
    if (confirm('Are you sure to delete this Program Partner?')) {
      this.programPartnersService.deleteProgramPartner(deletedRow).subscribe((result) => {
          this.alertService.warning(`Program Partner has been  deleted `);
          this.router.navigate(['/programCategory']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Program Partner could not be deleted`);
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
    if (!event.target.value)
      this.searchValue = ''
    else {
      this.searchValue = event.target.value;
    }
    this.reloadTable();
  }

}
