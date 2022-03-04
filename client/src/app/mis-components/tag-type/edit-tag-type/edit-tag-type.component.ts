import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert";
import {TagService} from "../../../services/tags";
import {EntityService} from "../../../services/entity.service";

@Component({
  selector: 'app-edit-tag-type',
  templateUrl: './edit-tag-type.component.html',
  styleUrls: ['./edit-tag-type.component.css']
})
export class EditTagTypeComponent implements OnInit {

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  misEntities = [];
  tagTypeId: any;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private tagService: TagService,
              private entityService: EntityService) { }

  ngOnInit(): void {
    this.tagTypeId = this.route.snapshot.params.id
    this.tagService.getCurrentTagType(this.tagTypeId).subscribe((results: any) => {
      this.formGroup = this.formBuilder.group({
        name: [results?.name, [Validators.required]],
        misEntity: [results?.misEntityId, [Validators.required]]
      });
    });
    this.entityService.getEntities().subscribe((data) => {
      this.misEntities = data;
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  editTagType() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const tagType = this.formGroup.value;
    this.tagService.updateTagType(this.tagTypeId, tagType).subscribe(results => {
      this.router.navigate(['/tagType']);
      this.alertService.success(`${tagType.name} has been successfully updated `);
    }, error => {
      this.alertService.error(`${tagType.name} could not be updated`);
    });

    if (this.formGroup.valid) {
      setTimeout(() => {
        this.formGroup.reset();
        this.submitted = false;
      }, 100);
    }
  }

  cancel(): void {
    window.history.back();
  }

}
