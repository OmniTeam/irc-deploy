import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpParams} from "@angular/common/http";
import {AlertService} from "../../services/alert";
import {TagService} from "../../services/tags";
import {EntityService} from "../../services/entity.service";

@Component({
  selector: 'app-tag-type',
  templateUrl: './tag-type.component.html',
  styleUrls: ['./tag-type.component.css']
})
export class TagTypeComponent implements OnInit {

  entries: number = 500;
  selected: any[] = [];
  activeRow: any;
  tagTypeId = '';
  search = '';
  page = {
    limit: this.entries,
    count: 0,
    offset: 50,
    orderBy: 'title',
    orderDir: 'desc'
  };
  private searchValue = '';
  tagTypes: Object[];
  closeResult: string;
  formGroup: FormGroup;
  formGp: FormGroup;
  rowData: any;
  submitted = false;
  misEntities = [];

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private modalService: NgbModal,
              private tagService: TagService,
              private entityService: EntityService) {
  }

  ngOnInit(): void {
    this.pageCallback({offset: 50});
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      misEntity: ['', Validators.required]
    });
    this.entityService.getEntities().subscribe((data) => {
      this.misEntities = data;
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  addTagType() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const newTagType = this.formGroup.value;
    this.tagService.addNewTagType(newTagType).subscribe(results => {
      this.alertService.success(`Tag Type: ${results.name} has been successfully created `);
      this.reloadTable();
      this.formGroup.reset();
    }, error => {
      this.alertService.error(`Tag Type: ${this.formGroup.controls.name.value} could not be created`);
    });
    this.modalService.dismissAll('Dismissed after saving data');
    this.router.navigate(['/tagType']);

    if (this.formGroup.valid) {
      setTimeout(() => {
        this.formGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  editTagType(row) {
    const editedRow = row.id;
    console.log(row);
  }

  deleteTagType(row) {
    const deletedRow = row.id;
    if (confirm('Are you sure to delete this Tag Type?')) {
      this.tagService.deleteTagType(deletedRow).subscribe((result) => {
          this.alertService.warning(`Tag Type has been  deleted `);
          this.router.navigate(['/tagType']);
          this.reloadTable();
        }, error => {
          this.alertService.error(`Tag Type: ${this.formGp.controls.name.value} could not be deleted`)
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
      .set('max', `${this.page.offset}`)
      .set('search', `${this.searchValue}`);

    this.tagService.getTagTypes(params).subscribe((data) => {
      console.log(data);
      this.tagTypes = data;
    });
  }

  entriesChange($event) {
    this.entries = $event.target.value;
    this.reloadTable();
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  filterTable($event) {
    this.search = $event.target.value;
    this.reloadTable();
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
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
