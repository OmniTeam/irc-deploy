import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../../services/alert';
import {TagService} from '../../../services/tags';
import {ProgramPartnersService} from '../../../services/program-partners.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.css']
})
export class EditTagsComponent implements OnInit {

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  tagTypes = [];
  tagId: any;
  programPartners: any;
  userRole: any;
  isAdmin: boolean;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private programPartnersService: ProgramPartnersService,
              private authService: AuthService,
              private tagService: TagService) { }

  ngOnInit(): void {
    this.tagId = this.route.snapshot.params.id;
    this.tagService.getCurrentTag(this.tagId).subscribe((results: any) => {
      this.userRole = this.authService.getUserRoles();
      if (this.userRole.includes('ROLE_SUPER_ADMIN') || this.userRole.includes('ROLE_ADMIN')) {
        this.isAdmin = true;
      }
      if (this.userRole.includes('ROLE_SUPER_ADMIN')  || this.userRole.includes('ROLE_SUPER_ADMIN') ) {
        this.formGroup = this.formBuilder.group({
          name: [results?.name, [Validators.required]],
          tagType: [results?.tagTypeId, [Validators.required]],
          partner: [results?.partner, Validators.required]
        });
      } else {
        this.formGroup = this.formBuilder.group({
          name: [results?.name, [Validators.required]],
          tagType: [results?.tagTypeId, [Validators.required]],
          partner: [results?.partner, Validators.required]
        });
      }
    });
    this.tagService.getAllTagTypes().subscribe((data) => {
      this.tagTypes = data;
    });
    this.programPartnersService.getProgramPartners().subscribe((data) => {
      this.programPartners = data;
    });

  }

  get f() {
    return this.formGroup.controls;
  }

  editTag() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const tag = this.formGroup.value;
    this.tagService.updateTag(this.tagId, tag).subscribe(results => {
      this.router.navigate(['/tags']);
      this.alertService.success(`${tag.name} has been successfully updated `);
    }, error => {
      this.alertService.error(`${tag.name} could not be updated`);
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
