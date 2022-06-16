import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../services/alert';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TagService} from '../../services/tags';
import {ProgramPartnersService} from '../../services/program-partners.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  entries = 10;
  selected: any[] = [];
  groupId = '';
  search = '';
  groups;
  private searchValue = '';
  tags: any;
  closeResult: string;
  formGroup: FormGroup;
  formGp: FormGroup;
  rows: Object[];
  temp: Object[];
  submitted = false;
  tagTypes = [];
  activeRow: any;
  programPartners: any;
  userRole: any;
  userPartners: any;
  isAdmin: boolean;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private modalService: NgbModal,
              private programPartnersService: ProgramPartnersService,
              private authService: AuthService,
              private tagService: TagService) {
  }

  ngOnInit(): void {
    this.userPartners = this.authService.retrieveUserPartners();
    this.reloadTable();
    this.userRole = this.authService.getUserRoles();
    if (this.userRole.includes('ROLE_SUPER_ADMIN')  || this.userRole.includes('ROLE_SUPER_ADMIN') ) {
      this.formGroup = this.formBuilder.group({
        name: ['', Validators.required],
        tagType: [null, Validators.required],
        partner: [null, Validators.required]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        name: ['', Validators.required],
        tagType: [null, Validators.required],
        partner: [this.userPartners, Validators.required]
      });
    }
    this.tagService.getAllTagTypes().subscribe((data) => {
      this.tagTypes = data;
    });
    this.programPartnersService.getProgramPartners().subscribe((data) => {
      this.programPartners = data;
    });
    if (this.userRole.toString() === ('ROLE_SUPER_ADMIN') || this.userRole.toString() === ('ROLE_ADMIN')) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  get f() {
    return this.formGroup.controls;
  }

  addTag() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const newTag = this.formGroup.value;
    console.log(this.formGroup.value, 'to be created');
    this.tagService.addNewTag(newTag).subscribe(results => {
      this.alertService.success(`Tag: ${results.name} has been successfully created `);
      this.reloadTable();
    }, error => {
      this.alertService.error(`Tag: ${this.formGroup.controls.name.value} could not be created`);
    });
    this.modalService.dismissAll('Dismissed after saving data');
    // this.router.navigate(['/tags']);
    this.reloadTable();

    if (this.formGroup.valid) {
      setTimeout(() => {
        this.formGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  editTag(row) {
    const id = row.id;
    this.router.navigate(['/tags/edit/' + id]);
  }

  deleteTag(row) {
    const deletedRow = row.id;
    if (confirm('Are you sure to delete this Tag?')) {
      this.tagService.deleteTag(deletedRow).subscribe((result) => {
          this.alertService.warning(`Tag has been  deleted `);
          this.router.navigate(['/tags']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Tag: ${this.formGp.controls.name.value} could not be deleted`);
        }
      );
    }
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
    const val = event.target.value.toLowerCase();
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

  reloadTable() {
    this.tagService.getTags().subscribe((data) => {
      this.temp = [...data];
      if (this.userRole.includes('ROLE_SUPER_ADMIN') || this.userRole.includes('ROLE_ADMIN') || this.userRole.includes('ROLE_STAFF_DATA_MANAGER') ) {
        this.rows = data;
      } else {
        this.rows = data.filter(a => a.partnerId === this.userPartners);
      }

      console.log(data);
    });
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

  onSearch(event) {
    this.reloadTable();
  }
}
