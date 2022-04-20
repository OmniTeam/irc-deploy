import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../services/alert";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UsersService} from "../../services/users.service";
import {RolesService} from "../../services/roles.service";
import * as XLSX from 'xlsx';
import {ReferralsService} from "../../services/referrals.service";

@Component({
  selector: 'app-users',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.css']
})
export class ReferralsComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  groupId = '';
  search = '';
  activeRow: any;
  private searchValue = '';
  tags: any
  closeResult: string;
  formGroup: FormGroup;
  formGp: FormGroup;
  rowData: any;
  submitted = false;
  private selectedUsers = [];
  private checkedRow: any;
  status=[
    {
      "name":"Actioned"
    },
    {
      "name":"Pending"
    }

  ];
  private partnerValue = '';
  private statusValue = '';
  private groupValue = '';
  users: any;
  referrals: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private modalService: NgbModal,
    private usersService: UsersService,
    private referralsService: ReferralsService,
  ) { }

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.reloadTable();
  }

  onChangePartner(event) {
    console.log(event)
    if (!event)
      this.partnerValue = ''
    else {
      this.partnerValue = event;
    }
    this.reloadTable();
  }

  onChangeStatus(event) {
    console.log(event)
    if (!event) {
      this.statusValue = ''
      this.reloadTable()
    }
    else {
      this.statusValue = event;
      this.referrals=this.referrals.filter(a => a.status.toUpperCase().includes(this.statusValue.toUpperCase()))
    }

  }

  onChangeSearch(event) {
    console.log(event.target.value)
    this.searchValue = event.target.value
    if(!this.searchValue){
      this.reloadTable()
    } else {
      this.referrals = this.referrals.filter(a => a.name_of_client_being_referred.toUpperCase().includes(this.searchValue.toUpperCase()))
    }
  }

  entriesChange($event) {
    this.entries = $event.target.value;
    console.log(this.entries,"Entries")
  }

  reloadTable() {
    this.referralsService.getReferrals().subscribe((data) => {
      this.referrals = data.filter(a => a.status);
      console.log(data)
    });
  }

  createReferral() {
    this.router.navigate(['generate-referral']);
  }

  actionReferral() {
    this.router.navigate(['action-referral']);
  }

  editUser(row) {
    this.router.navigate(['edit-referral' + row.id]);
  }

  onSelected(event) {
    if (event.target.checked) {
      this.checkedRow = event.target.value;
      this.selectedUsers.push(this.checkedRow)
    } else { /*if it is not checked*/
      const x = this.selectedUsers.indexOf(this.checkedRow);
      this.selectedUsers.splice(x, 1);
    }
    console.log(this.selectedUsers);
  }

  deleteUsers() {
    const deletedRow = this.selectedUsers;
    deletedRow.forEach((p) => {
        this.usersService.deleteCurrentUser(p).subscribe((result) => {
          console.warn(result, 'Users have been deleted');
          this.router.navigate(['/users']).then(() => {
            window.location.reload();
          });
        })
      }
    )
  }

  downloadReferrals(): void {
    const fileName = 'Referrals_list.xlsx';
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.referrals);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }

  /*Responsible for the opening of the Modals*/
  open(content) {
    this.modalService.open(content,
      {
        ariaLabelledBy: 'modal-basic-title'
      }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  /*Responsible for Closing the Modal*/
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onActivate(event) {
    this.activeRow = event.row;
  }
}
