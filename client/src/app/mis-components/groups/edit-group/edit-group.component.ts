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
import {GroupValidator} from "../../../validators/group.validator";

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {
  ACD: any;

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
  parents:any
  programs:any;
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
    this.groupsService.getGroups().subscribe(data => {
      this.parents = data
      console.log(data)
    }, error => {
      this.alertService.error("Failed to get Parents")
    })
    this.usersService.getPrograms().subscribe(data => {
      this.programs = data
      console.log(data)
    }, error => {
      this.alertService.error("Failed to get Programs")
    })
    this.usersService.getUsers().subscribe(data => {
      this.dataCollectors = data
      console.log(this.dataCollectors)
    }, error => {
      this.alertService.error("Failed to get Data Collectors")
    })
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

  // shows data collectors based on access to central data toggle
  changeCentralDataAccess() {
    this.ACD = this.f['access_to_central_data'].value
    console.log(this.ACD)
    if (this.ACD === true) {
      this.f['data_collectors'].reset()
      document.getElementById('data_collectors').hidden = false
    } else {
      this.f['data_collectors'].reset()
      document.getElementById('data_collectors').hidden = true
    }


  }

  goBack() {
    this.router.navigate(['/groups'])
  }
}
