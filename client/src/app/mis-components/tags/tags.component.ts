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

  entries: number = 10;
  selected: any[] = [];
  groupId = '';
  search = '';
  groups;
  private searchValue = '';
  tags: any
  closeResult: string;
  formGroup: FormGroup;
  formGp: FormGroup;
  rows: Object[];
  temp: Object[];
  submitted = false;
  tagTypes = [];
  activeRow: any;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private modalService: NgbModal,
              private tagService: TagService) {
  }

  ngOnInit(): void {
    this.reloadTable();
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
    const id = row.id;
    this.router.navigate(['/tags/edit/'+ id]);
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
    let val = event.target.value.toLowerCase();
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
      this.rows = data;
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
}
