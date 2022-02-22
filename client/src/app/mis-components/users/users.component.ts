import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../services/alert";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpParams} from "@angular/common/http";
import {GroupsService} from "../../services/groups.service";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  entries: number = 500;
  selected: any[] = [];
  groupId = '';
  search = '';
  page = {
    limit: this.entries,
    count: 0,
    offset: 100,
    orderBy: 'title',
    orderDir: 'desc'
  };
  private searchValue = '';
  tags: any
  closeResult: string;
  formGroup: FormGroup;
  formGp: FormGroup;
  rowData: any;
  submitted = false;
  private selectedUsers = [];
  private checkedRow: any;
  groups = [
    {
      name: "Partner 4",
    },
    {
      name: "Partner 1",
    },
    {
      name: "Uganda",
    },
    {
      name: "CRVP-Staff",
    },
  ]
  partners = [
    {
      'name': 'Partner 1',
    },
    {
      'name': 'Partner 2',
    },
    {
      'name': 'Partner 3',
    },
    {
      'name': 'Partner 4',
    },
  ];
  roles = [
    {
      'name': 'Active',
      'value': true
    },
    {
      'name': 'Inactive',
      'value': false
    }
  ];
  private partnerValue = '';
  private roleValue = '';
  private groupValue = '';
  users: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private modalService: NgbModal,
    private usersService: UsersService
  ) { }

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.pageCallback({offset: 0});
    /*this.formGroup = this.formBuilder.group({
      username: [''],
      first_name: [''],
      last_name: [''],
      telephone: [''],
      email: [''],
      password: [''],
      is_active: [''],
      user_type: [''],
      data_collector_type: [''],
    });*/
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

  onChangeRoles(event) {
    console.log(event)
    if (!event)
      this.roleValue = ''
    else {
      this.roleValue = event;
    }
    this.reloadTable();
  }

  onChangeGroup(event) {
    console.log(event)
    if (!event)
      this.groupValue = ''
    else {
      this.groupValue = event;
    }
    this.reloadTable();
  }

  onChangeSearch(event) {
    console.log(event.target.value)
    if (!event.target.value)
      this.searchValue = ''
    else {
      this.searchValue = event.target.value;
    }
    this.reloadTable();
  }

  reloadTable() {
    // NOTE: those params key values depends on your API!
    const params = new HttpParams()
      .set('partner', `${this.partnerValue}`)
      .set('role', `${this.roleValue}`)
      .set('group', `${this.groupValue}`)
      .set('search', `${this.searchValue}`);

    this.usersService.getUsersFiltered(params).subscribe((data) => {
      this.users = data
      this.page.count = data.length
      // console.log(this.users, 'these are the users')
    });
  }

  createUser() {
    this.router.navigate(['user/create/']);
  }

  editUser(row) {
    this.router.navigate(['user/edit/' + row.id]);
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
          console.warn(result, 'Tags have been deleted');
          this.router.navigate(['/groups']).then(() => {
            window.location.reload();
          });
        })
      }
    )
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

  entriesChange($event) {
    this.entries = $event.target.value;
    this.reloadTable();
  }

  pageCallback(pageInfo: { count?: number, pageSize?: number, limit?: number, offset?: number }) {
    this.page.offset = pageInfo.offset;
    this.reloadTable();
  }

  sortCallback(sortInfo: { sorts: { dir: string, prop: string }[], column: {}, prevValue: string, newValue: string }) {
    // there will always be one "sort" object if "sortType" is set to "single"
    this.page.orderDir = sortInfo.sorts[0].dir;
    this.page.orderBy = sortInfo.sorts[0].prop;
    this.reloadTable();
  }
}
