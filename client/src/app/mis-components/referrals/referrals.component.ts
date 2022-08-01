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
import {AuthService} from '../../services/auth.service';
import {TaskListService} from "../../services/task-list.service";
import {HttpParams} from "@angular/common/http";

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
  userRole: any;
  referralIRC: any;
  referralRelon: any;
  referralPlavu: any;
  referralGabdho: any;
  referralMakasi: any;
  archive: any;
  disable: boolean;
  archiveList: any;
  processId: any;
  referralId: any;
  initialLists: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private usersService: UsersService,
    private referralsService: ReferralsService,
    private taskListService: TaskListService,
    private rolesService: RolesService
  ) { }

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRoles();
    this.reloadTable();
    this.cardsData();
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
    this.searchValue = event.target.value
    if(!this.searchValue){
      this.reloadTable()
    } else {
      this.referrals = this.referrals.filter(a => a.nameOfClientBeingReferred.includes(this.searchValue))
    }
  }

  getArchiveRecords(id, archive) {
    const params = new HttpParams().set('id', id);
    this.referralId = id;
    this.referralsService.getCurrentReferral(this.referralId).subscribe(data => {
      this.initialLists = data
      console.log("archive",this.initialLists)
    })
    this.taskListService.getArchiveRecordDetails(params).subscribe(data => {
      this.archiveList = data;
      this.disable = true;
    });

    this.modalService.open(archive, {scrollable: true,size: 'xl'});
    // this.router.navigate(['/archive/' + id]);
  }

  entriesChange($event) {
    this.entries = $event.target.value;
    console.log(this.entries,"Entries")
  }

  getDate(date) {
    return new Date(date);
  }

  reloadTable() {
    this.referralsService.getReferrals().subscribe((data) => {
      this.referrals = data.filter(a => a.status);
      this.cardsData()
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

  cardsData() {
    this.referralIRC = this.referrals.filter(a => a?.internalExternal.includes("Internal")).length
    this.referralRelon = this.referrals.filter(a => a?.organizationReferredTo.includes("Relon")).length
    this.referralPlavu = this.referrals.filter(a => a?.organizationReferredTo.includes("Plavu")).length
    this.referralGabdho = this.referrals.filter(a => a?.organizationReferredTo.includes("Raising Gabdho Foundation")).length
    this.referralMakasi = this.referrals.filter(a => a?.organizationReferredTo.includes("Makasi Rescue Foundation")).length
  }

  deleteReferral() {
    const deletedRow = this.selectedUsers;
    if (confirm('Are you sure to delete these Record?')) {
      deletedRow.forEach((p) => {
          this.referralsService.deleteCurrentReferral(p).subscribe((result) => {
            console.warn(result, 'Referral have been deleted');
            this.router.navigate(['/referrals/list']).then(() => {
              window.location.reload();
            });
          })
        }
      )
    }
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

  editReferral(id) {
    this.router.navigate(['/referral-edit/' + id,false]);
  }
}
