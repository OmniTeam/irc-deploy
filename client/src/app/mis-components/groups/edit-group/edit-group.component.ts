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

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {

  constructor(
    private groupsService: GroupsService,
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
  parents = [
    {
      name: "Partner 4",
    },
    {
      name: "Partner 1",
    },
    {
      name: "Uganda",
    },
    {
      name: "CRVP-Staff",
    },
  ]
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
  dataCollectors =[
    {
      'name': 'Okello Marvin'
    },
    {
      'name': 'Lewis Hamilton'
    },
    {
      'name': 'Pierre Gasly'
    },
  ]


  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.groupsService.getCurrentGroup(this.route.snapshot.params.id).subscribe((results: any) => {
      this.formGroup = this.formBuilder.group({
        name: [results?.name],
        parent: [results?.parent],
        access_to_central_data: [results?.access_to_central_data],
        permissions: [results?.permissions],
        data_collectors: [results?.data_collectors]
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
    /*const formData = Object.keys(fData).filter(item => fData[item] != undefined || fData[item] != null);
    const submitData = {};
    formData.forEach(item => Object.assign(submitData, {[item]: fData[item]}));
    console.log(submitData);*/
    this.groupsService.updateGroup(this.route.snapshot.params.id, submitData).subscribe((result) => {
      console.warn(result, 'Group Successfully');
      this.alertService.success(`Group: ${result.name} has been successfully updated`)
      this.router.navigate(['/groups']);
    }, error => {
      this.alertService.error(`Failed to update group: ${this.formGroup.controls.name.value}`)
    });
  }
}
