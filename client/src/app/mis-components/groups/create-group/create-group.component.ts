import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {UsersService} from '../../../services/users.service';
import {TagService} from '../../../services/tags';
import {AlertService} from '../../../services/alert';
import {GroupsService} from '../../../services/groups.service';


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  ACD: boolean;

  constructor(
    private groupsService: GroupsService,
    private usersService: UsersService,
    private tagsService: TagService,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  clicked = false;
  currentDashboards: any;
  formGroup: FormGroup;
  formData: any;
  submitted = false;
  parents: any;
  users: any;

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(results => {
      this.users = results;
    }, error => {
      this.alertService.error('Failed to get Users');
    });
    this.groupsService.getGroups().subscribe(results => {
      this.parents = results;
    }, error => {
      this.alertService.error('Failed to get Parents Groups');
    });
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      parentGroup: [null],
      users: [null]
    });
  }


  createGroup() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const formData = this.formGroup.value;
    console.log(formData);

    this.groupsService.createGroup(formData).subscribe((result) => {
      console.warn(result, 'Group created Successfully');
      this.alertService.success(`Group has been created`);
      this.router.navigate(['/groups']);

      // insert kenga_group_id and user_id into table. This tracks users who belong to the group
      for(let i = 0; i < formData.users.length; i++) {
        const KengaUserGroupData = new FormData();
        KengaUserGroupData.append('kengaGroup', result.id);
        KengaUserGroupData.append('user', formData.users[i]);

        this.groupsService.createKengaUserGroup(KengaUserGroupData).subscribe(data => {
          console.log(data , 'Kenga User Group details');
        }, error => {this.alertService.error('failed to create Kenga User Groups'); });
      }
    }, error => {
      this.alertService.error('Failed to Create the Group');
    });
  }

  goBack() {
    this.router.navigate(['/groups']);
  }

}
