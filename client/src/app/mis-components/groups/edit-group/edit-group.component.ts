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
  dataCollectors: any


  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.groupsService.getGroups().subscribe(data =>{
      this.parents=data
      // console.log(this.parents)
    }, error => {this.alertService.error("Failed to get Parents")})
    this.usersService.getUsers().subscribe(data =>{
      this.dataCollectors=data
      // console.log(this.dataCollectors)
    }, error => {this.alertService.error("Failed to get Data Collectors")})
    this.groupsService.getCurrentGroup(this.route.snapshot.params.id).subscribe((results: any) => {
      console.log(results,"this group data")
      this.formGroup = this.formBuilder.group({
        name: [results[0]?.name],
        parent: [results?.parent],
        data_collectors: [results[0]?.data_collectors]
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
    console.log(submitData)
    /*const params =new HttpParams().set('id', this.route.snapshot.params.id)
    this.groupsService.deleteOldKengauserGroups(params).subscribe(result =>{
      console.log(result)
    })*/

    this.groupsService.updateGroup(this.route.snapshot.params.id, submitData).subscribe((result) => {
      console.warn(result, 'Group Successfully');
      this.alertService.success(`Group: ${result.name} has been successfully updated`)
      this.router.navigate(['/groups']);
    }, error => {
      this.alertService.error(`Failed to update group: ${this.formGroup.controls.name.value}`)
    });
  }
}
