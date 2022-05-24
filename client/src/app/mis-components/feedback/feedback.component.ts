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
import {FeedbackService} from "../../services/feedback.service";
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

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
  feedback_status = [
    {
      "name": "Actioned"
    },
    {
      "name": "Under Review"
    },
    {
      "name": "No Action Required"
    },
    {
      "name": "Forwarded for Action"
    },

  ];
  private partnerValue = '';
  private statusValue = '';
  private groupValue = '';
  users: any;
  active_div = ''
  feedback: any;
  feedbackForwarded: any;
  feedbackNotActioned: any;
  feedbackUnderReview: any;
  feedbackActioned: any;
  feedbackRegistered: any;
  userRole: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private usersService: UsersService,
    private feedbackService: FeedbackService,
  ) {
  }

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRoles();
    this.reloadTable();
  }

  clickRegisteredFeedback() {
    this.active_div = 'clickRegisteredFeedback'
    this.reloadTable()
  }

  clickActioned() {
    this.active_div = 'clickActioned'
    this.feedbackService.getFeedback().subscribe((data) => {
      this.feedback = data.filter(a => a.currentStatusOfFeedback.includes("Actioned"))
    });
  }

  clickUnderReview() {
    this.active_div = 'clickUnderReview'
    this.feedbackService.getFeedback().subscribe((data) => {
      this.feedback = data.filter(a => a.currentStatusOfFeedback.includes("Under Review"))
    });
  }

  clickNotActioned() {
    this.active_div = 'clickNotActioned'
    this.feedbackService.getFeedback().subscribe((data) => {
      this.feedback = data.filter(a => a.currentStatusOfFeedback.includes("No Actioned Required"))
    });
  }

  clickForwarded() {
    this.active_div = 'clickForwarded'
    this.feedbackService.getFeedback().subscribe((data) => {
      this.feedback = data.filter(a => a.currentStatusOfFeedback.includes("Forwarded For Action"))
    });
  }

  clickReset() {
    this.active_div=''
    this.reloadTable()
  }

  cardsData() {
    this.feedbackRegistered = this.feedback.length
    this.feedbackActioned = this.feedback.filter(a => a.currentStatusOfFeedback.includes("Actioned")).length
    this.feedbackUnderReview = this.feedback.filter(a => a.currentStatusOfFeedback.includes("Under Review")).length
    this.feedbackNotActioned = this.feedback.filter(a => a.currentStatusOfFeedback.includes("No Actioned Required")).length
    this.feedbackForwarded = this.feedback.filter(a => a.currentStatusOfFeedback.includes("Forwarded For Action")).length
  }

  onChangeStatus(event) {
    console.log(event)
    if (!event) {
      this.statusValue = ''
      this.reloadTable()
    } else {
      this.statusValue = event;
      this.feedback = this.feedback.filter(a => a.currentStatusOfFeedback.toUpperCase().includes(this.statusValue.toUpperCase()))
    }

  }

  onChangeSearch(event) {
    console.log(event.target.value)
    this.searchValue = event.target.value
    if (!this.searchValue) {
      this.reloadTable()
    } else {
      this.feedback = this.feedback.filter(a => a.nameOfClient.toUpperCase().includes(this.searchValue.toUpperCase()) || a.nameOfClient.toUpperCase().includes(this.searchValue.toUpperCase()))
    }
  }

  entriesChange($event) {
    this.entries = $event.target.value;
    console.log(this.entries, "Entries")
  }

  reloadTable() {
    this.feedbackService.getFeedback().subscribe((data) => {
      this.feedback = data;
      this.cardsData()
      console.log(data)
    });
  }

  createFeedback() {
    this.router.navigate(['create-feedback']);
  }

  actionFeedback() {
    this.router.navigate(['action-feedback']);
  }

  editFeedback(row) {
    this.router.navigate(['edit-feedback' + row.id]);
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

  deleteFeedback() {
    const deletedRow = this.selectedUsers;
    deletedRow.forEach((p) => {
        this.feedbackService.deleteCurrentFeedback(p).subscribe((result) => {
          console.warn(result, 'Feedback has been deleted');
          this.router.navigate(['/feedback-list']).then(() => {
            window.location.reload();
          });
        })
      }
    )
  }

  downloadFeedback(): void {
    const fileName = 'Referrals_list.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.feedback);

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
