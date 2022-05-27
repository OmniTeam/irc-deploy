import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AlertService} from '../../services/alert';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GroupsService} from '../../services/groups.service';
import {AclGroupMappingService} from '../../services/acl-group-mapping.service';
import {KengaDataTablesService} from '../../services/kenga-data-tables.service';

@Component({
  selector: 'app-acl-group-mapping-lists',
  templateUrl: './acl-group-mapping-lists.component.html',
  styleUrls: ['./acl-group-mapping-lists.component.css']
})
export class AclGroupMappingListsComponent implements OnInit {

  entries = 10;
  selected: any[] = [];
  groupId = '';
  page = {
    limit: this.entries,
    count: 0,
    offset: 0,
    orderBy: 'title',
    orderDir: 'desc'
  };
  tags: any;
  closeResult: string;
  formGroup: FormGroup;
  formGp: FormGroup;
  rowData: any;
  submitted = false;
  selectedEntries = [];
  private checkedRow: any;
  aclsEntries: any;
  groups: any;
  kengaDataTables: any;
  private groupValue = '';
  private tableValue = '';
  currentGroups: any;
  currentTables: any;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              // tslint:disable-next-line:no-shadowed-variable
              private AclGroupMappingService: AclGroupMappingService,
              private alertService: AlertService,
              private kengaDataTablesService: KengaDataTablesService,
              private router: Router,
              private modalService: NgbModal,
              private groupsService: GroupsService
  ) {
  }

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.groupsService.getGroups().subscribe(data => {
      this.groups = data;
    }, error => this.alertService.error('Failed to get Groups'));
    this.kengaDataTablesService.getTables().subscribe(data => {
      this.kengaDataTables = data;
    }, error => this.alertService.error('Failed to get Data Tables'));
    this.reloadTable();
  }

  addNewAcls() {
    this.router.navigate(['acl-group-mapping-parent']);
  }

  onSelected(event) {
    // console.log(event.target.value)
    /*If it is checked*/
    if (event.target.checked) {
      this.checkedRow = event.target.value;
      this.selectedEntries.push(this.checkedRow);
    } else { /*if it is not checked*/
      const x = this.selectedEntries.indexOf(this.checkedRow);
      this.selectedEntries.splice(x, 1);
    }
    console.log(this.selectedEntries);
  }

  deleteACLS(data) {
    data.forEach((p) => {
        this.AclGroupMappingService.deleteCurrentACL(p).subscribe((result) => {
          console.warn(result, 'ACLS have been deleted');
        });
      }
    );
    this.router.navigate(['/acl-group-mapping-lists']).then(() => {
      window.location.reload();
    });
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

  onChangeGroup(event) {
    console.log(event);
    if (!event) {
      this.groupValue = '';
      this.reloadTable();
    } else {
      this.groupValue = event;
      this.aclsEntries = this.aclsEntries.filter(a => a.group.includes(this.groupValue))
    }

  }
  onChangeTable(event) {
    console.log(event);
    if (!event) {
      this.tableValue = '';
      this.reloadTable();
    } else {
      this.tableValue = event;
      this.aclsEntries = this.aclsEntries.filter(a => a.table.includes(this.tableValue));
    }

  }

  reloadTable() {
    this.AclGroupMappingService.listAllACLS().subscribe((data) => {
      this.aclsEntries = data;
      this.currentGroups = [...new Set(data.map( (a) => a.group))];
      this.currentTables = [...new Set(data.map( (a) => a.table))];
      this.page.count = this.aclsEntries.length;
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
