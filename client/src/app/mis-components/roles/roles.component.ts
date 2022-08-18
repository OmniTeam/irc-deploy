import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../services/alert';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RolesService} from '../../services/roles.service';

@Component({
  selector: 'app-groups',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  entries = 10;
  selected: any[] = [];
  groupId = '';
  search = '';
  page = {
    limit: this.entries,
    count: 0,
    offset: 0,
    orderBy: 'title',
    orderDir: 'desc'
  };
  private searchValue = '';
  tags: any;
  closeResult: string;
  formGroup: FormGroup;
  formGp: FormGroup;
  rowData: any;
  submitted = false;
  private selectedTags = [];
  private checkedRow: any;
  roles: any;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private modalService: NgbModal,
              private rolesService: RolesService
  ) {
  }

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.reloadTable();
  }


  addRole() {
    this.router.navigate(['role/create']);
  }

  editTag(row) {
    this.router.navigate(['role/edit/' + row.id]);
  }

  onSelected(event) {
    // console.log(event.target.value)
    /*If it is checked*/
    if (event.target.checked) {
      this.checkedRow = event.target.value;
      this.selectedTags.push(this.checkedRow);
    } else { /*if it is not checked*/
      const x = this.selectedTags.indexOf(this.checkedRow);
      this.selectedTags.splice(x, 1);
    }
    console.log(this.selectedTags);
  }

  deleteRole(row) {
    this.rolesService.deleteCurrentRole(row.id).subscribe((result) => {
      console.warn(result, 'Roles have been deleted');
      this.router.navigate(['/roles']).then(() => {
        window.location.reload();
      });
    });
  }

  deleteRoles() {
    const deletedRow = this.selectedTags;
    deletedRow.forEach((p) => {
        this.rolesService.deleteCurrentRole(p).subscribe((result) => {
          console.warn(result, 'Tags have been deleted');
          this.router.navigate(['/roles']).then(() => {
            window.location.reload();
          });
        });
      }
    );
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

  onChangeSearch(event) {
    console.log(event.target.value);
    this.searchValue = event.target.value;
    if (!this.searchValue) {
      this.reloadTable();
    } else {
      this.roles = this.roles.filter(a => a.authority.toUpperCase().includes(this.searchValue.toUpperCase()));
    }
  }

  reloadTable() {
    this.rolesService.getRoles().subscribe((data) => {
      this.roles = data;
      // console.log(this.roles);
      this.page.count = this.roles.length;
    });
  }

  entriesChange($event) {
    console.log($event.target.value);
    this.entries = $event.target.value;
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
