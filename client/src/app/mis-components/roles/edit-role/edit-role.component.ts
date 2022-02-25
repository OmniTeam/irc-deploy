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
import {RolesService} from "../../../services/roles.service";

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {

  constructor(
    private rolesService: RolesService,
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


  get f() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.rolesService.getCurrentRole(this.route.snapshot.params.id).subscribe((results: any) => {
      console.log(results,  "--------------")
      this.formGroup = this.formBuilder.group({
        authority: [results?.authority],
      });
    });
  }

  deleteRole() {
    if (confirm('Are you sure to delete this Role?')) {
      console.log(
        this.rolesService.deleteCurrentRole(this.route.snapshot.params.id).subscribe((result) => {
            console.warn(result, 'Role has been deleted');
            this.alertService.warning(`Role has been deleted`)
            this.router.navigate(['/roles']);
          }, error => {
            this.alertService.error(`Failed to delete Role: ${this.formGroup.controls.authority.value}`)
          }
        ));
    }
  }

  updateRole() {
    this.clicked = true;
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }
    const submitData = this.formGroup.value;
    console.log(submitData)
    this.rolesService.updateRole(this.route.snapshot.params.id, submitData).subscribe((result) => {
      console.warn(result, 'Role Successfully');
      this.alertService.success(`Role: ${result.authority} has been successfully updated`)
      this.router.navigate(['/roles']);
    }, error => {
      this.alertService.error(`Failed to update Role: ${this.formGroup.controls.authority.value}`)
    });
  }
}
