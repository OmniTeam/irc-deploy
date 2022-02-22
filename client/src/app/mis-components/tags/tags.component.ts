import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../services/alert";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TagService} from "../../services/tags";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  entries: number = 500;
  selected: any[] = [];
  groupId = '';
  search = '';
  groups;
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
  tagTypes = [];

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private modalService: NgbModal,
              private tagService: TagService) {
  }

  ngOnInit(): void {
    this.pageCallback({offset: 100});
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      tagType: ['', Validators.required]
    });
    this.tagService.getAllTagTypes().subscribe((data) => {
      this.tagTypes = data;
    });
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
    this.tagService.addNewTag(newTag).subscribe(results => {
      this.alertService.success(`Tag: ${results.name} has been successfully created `);
      this.reloadTable();
    }, error => {
      this.alertService.error(`Tag: ${this.formGroup.controls.name.value} could not be created`);
    });
    this.modalService.dismissAll('Dismissed after saving data');
    this.router.navigate(['/tags']);

    if (this.formGroup.valid) {
      setTimeout(() => {
        this.formGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  editTag(row) {
    const editedRow = row.id;
    console.log(row);
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

    this.tagService.getTags(params).subscribe((data) => {
      this.tags = data;
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
