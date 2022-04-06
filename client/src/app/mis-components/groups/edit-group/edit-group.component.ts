import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from "../../../services/users.service";
import {AlertService} from "../../../services/alert";
import {AuthService} from "../../../services/auth.service";
import {GroupsService} from "../../../services/groups.service";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {
  ACD: boolean;

  constructor(
    private groupsService: GroupsService,
    private usersService: UsersService,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  clicked = false;
  result: any;
  formGroup: FormGroup;
  formData: any;
  deactivate = false;
  submitted = false;
  data_collector_Type = [
    {
      'name': 'Enumerator'
    },
    {
      'name': 'Field Staff'
    }
  ];
  parents: any
  permissions =[
    {
      'name': 'Data Tables'
    },
    {
      'name': 'Task List'
    },
    {
      'name': 'Reports'
    },
  ]
  users: any


  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.groupsService.getGroups().subscribe(data =>{
      this.parents=data
    }, error => {this.alertService.error("Failed to get Parents")})
    this.usersService.getUsers().subscribe(data =>{
      this.users=data
    }, error => {this.alertService.error("Failed to get Users")})
    this.groupsService.getCurrentGroup(this.route.snapshot.params.id).subscribe((results: any) => {
      this.formGroup = this.formBuilder.group({
        name: [results[0]?.name],
        parentGroup: [results[0]?.parentGroup],
        users: [results[0]?.users]
      });
    });
  }

  deleteGroup() {
    if (confirm('Are you sure to delete this Group?')) {
      console.log(
        this.groupsService.deleteCurrentGroup(this.route.snapshot.params.id).subscribe((result) => {
            console.warn(result, 'Group has been deleted');
            this.alertService.warning(`Group has been deleted`)
            this.router.navigate(['/groups']);
          }, error => {
            this.alertService.error(`Failed to delete Group: ${this.formGroup.controls.name.value}`)
          }
        ));
    }
  }

  updateGroup() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const submitData = this.formGroup.value;
    const params =new HttpParams()
      .set('id', this.route.snapshot.params.id)
      .set('users',submitData.users)

    this.groupsService.updateGroup(this.route.snapshot.params.id, submitData, params).subscribe((result) => {
      this.alertService.success(`Group: ${result.name} has been successfully updated`)
      this.router.navigate(['/groups']);
    }, error => {
      this.alertService.error(`Failed to update group: ${this.formGroup.controls.name.value}`)
    });
  }
}
