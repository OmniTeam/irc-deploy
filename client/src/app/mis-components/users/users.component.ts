import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../services/alert";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UsersService} from "../../services/users.service";
import {RolesService} from "../../services/roles.service";
import {GroupsService} from "../../services/groups.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

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
  groups: any
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
  roles: any;
  private partnerValue = '';
  private roleValue = '';
  private groupValue = '';
  users: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private groupsService: GroupsService,
    private router: Router,
    private modalService: NgbModal,
    private usersService: UsersService,
    private rolesService: RolesService,
  ) {
  }

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.reloadTable();
    this.rolesService.getRoles().subscribe(results => {
      this.roles = results
    }, error => {
      this.alertService.error("Failed to get Roles")
    })

    this.groupsService.getGroups().subscribe(data => {
      this.groups = data
    }, error => {
      this.alertService.error("Failed to get Groups")
    })
  }

  onChangeRoles(event) {
    console.log(event)
    if (!event) {
      this.roleValue = ''
      this.reloadTable()
    } else {
      this.roleValue = event;
      this.users=this.users.filter(a => a.role === this.roleValue)
    }

  }

  onChangeGroup(event) {
    console.log(event)
    if (!event) {
      this.groupValue = ''
      this.reloadTable()
    } else {
      this.groupValue = event;
      this.users = this.users.filter(a => a.groups === this.groupValue)
    }

  }

  onChangeSearch(event) {
    console.log(event.target.value)
    this.searchValue = event.target.value
    if (!this.searchValue) {
      this.reloadTable()
    } else {
      this.users = this.users.filter(a => a.username.toUpperCase().includes(this.searchValue.toUpperCase()) || a.names.toUpperCase().includes(this.searchValue.toUpperCase()))
    }
  }

  entriesChange($event) {
    this.entries = $event.target.value;
    console.log(this.entries, "Entries")
    this.reloadTable();
  }

  reloadTable() {
    if(this.router.url.includes('mis-users')){
      this.usersService.getMISUsers().subscribe((data) => {
        this.users = data;
        console.log(data,"mis users")
      });

    } else {
      this.usersService.getUsers().subscribe((data) => {
        this.users = data;
      });
    }

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
          console.warn(result, 'Users have been deleted');
          this.router.navigate(['/users']).then(() => {
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

  onActivate(event) {
    this.activeRow = event.row;
  }
}
