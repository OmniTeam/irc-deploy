import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../../services/alert';
import {ProgramPartnersService} from '../../../services/program-partners.service';
import {CountriesService} from '../../../services/countries.service';
import {v4 as uuid} from 'uuid';
import {CellEdit, OnUpdateCell} from '../../../helpers/cell-edit';
import {UsersService} from '../../../services/users.service';
import {Validator} from '../../../helpers/validator';
import {GroupsService} from '../../../services/groups.service';
import {AclGroupMappingService} from '../../../services/acl-group-mapping.service';
import {HttpParams} from '@angular/common/http';
import {EntityViewFiltersService} from '../../../services/entity-view-filters.service';
import {EntityService} from '../../../services/entity.service';

@Component({
  selector: 'app-create-program-partners',
  templateUrl: './create-program-partners.component.html',
  styleUrls: ['../program-partners.component.css']
})
export class CreateProgramPartnersComponent implements OnInit, OnUpdateCell {

  formGroup: FormGroup;
  submitted = false;
  inValidNumber = false;
  formData: any;
  programs = [];
  countries = [];
  cities = [];
  organisationsInvolved: any = [];
  username: string;
  groupName: any;
  groupParent: any;
  groupCreationFormGroup: FormGroup;
  createdGroupId: any;
  formConditionalQuery: any;
  entityConditionalQuery: any;
  formNames = [
    '__37_xxx_safe_environment_for_adolescents',
    '__38_xxx_economic_empowerment_activity',
    '__39_xxx_good_school_environment',
    '__40_xxx_monitoring_and_learning',
    '__41_xxx_parenting_skills_and_spousal_relationship'
  ];
  entityNames = ['entity_beneficiary_list'];
  entityViews = [
    'Schools',
    'Parent groups',
    'Parents',
    'Leaders',
    'Safe Spaces',
    'Clusters',
    'Club Members',
    'Youth and women',
    'Adolescents',
    'VSLA Groups',
    'Youth and women groups'
  ];
  aclsFormGroup: FormGroup;
  editIndex = -1;
  entityViewFilterGroup: FormGroup;
  createdGroupName: any;
  currentDataCollector: any;
  views: any;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private countriesService: CountriesService,
              private aclGroupMappingService: AclGroupMappingService,
              private entityViewFiltersService: EntityViewFiltersService,
              private router: Router,
              private usersService: UsersService,
              private groupsService: GroupsService,
              private entityService: EntityService,
              private programPartnersService: ProgramPartnersService) {
  }

  ngOnInit(): void {
    this.countries = this.countriesService.getListOfAvailableCountries();
    this.formGroup = this.formBuilder.group({
      program: [null, [Validators.required]],
      cluster: [null, [Validators.required]],
      organisation: [null],
      physicalAddress: [null],
      organisationType: [null],
      nameContactPerson: [null],
      telephoneContactPerson: [null, [Validators.required]],
      emailContactPerson: [null, [Validators.required, Validators.email]],
      country: [null],
      city: [null],
      dataCollector: [null],
      organisationsInvolved: [null],
      areaOfOperation: [null]
    });
    this.entityService.getEntityViews().subscribe((data) => {
      this.views = data;
    });
    this.programPartnersService.getPrograms().subscribe((data) => {
      this.programs = data;
    });
    this.programPartnersService.getDataCollector().subscribe(res => {
      this.currentDataCollector = res.user_id;
      this.formGroup.patchValue({dataCollector: res.user_id});
      this.usersService.getCurrentUser(res.user_id).subscribe((data: any) => {
        this.username = data.names;
      });
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  createProgramPartner() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      console.log('Invalid');
      return;
    }

    this.formGroup.patchValue({organisationsInvolved: JSON.stringify(this.organisationsInvolved)});
    const programPartner = this.formGroup.value;
    console.log('Form Data', programPartner);
    this.programPartnersService.createProgramPartner(programPartner).subscribe(results => {
      this.alertService.success(`${programPartner.cluster} has been successfully created `);
    }, error => {
      this.alertService.error(`${programPartner.cluster} could not be created`);
    });

    // collecting variables for creating the group
    this.groupName = programPartner['cluster'];
    this.groupParent = programPartner['program'];

    // creating a form group for creating a group
    this.groupCreationFormGroup = this.formBuilder.group({
      name: [this.groupName],
      parentGroupId: [this.groupParent],
    });

    // creating a group
    console.log(this.groupCreationFormGroup.value, 'group controls');
    this.groupsService.createGroup(JSON.stringify(this.groupCreationFormGroup.value)).subscribe((result) => {
      console.warn(result, 'Group created Successfully');
      this.createdGroupId = result.id;
      this.createdGroupName = result.name;
      this.alertService.success(`Group has been created`);

      // create entityViewFilter
      // loop through the array containing entity views and for each create a filter list
      this.views.forEach((oneView) => {
        const params = new HttpParams()
          .set('name', oneView.name)
          .set('group', result.name);
        this.entityViewFiltersService.generateFullFilterQuery(params).subscribe((results: any) => {
          // const query = results.viewQuery;
          // create the entity view filter from here
          this.entityViewFilterGroup = this.formBuilder.group({
            name: [this.createdGroupName + ' ' + oneView.name],
            entityView: [oneView.id],
            filterQuery: [results?.viewQuery],
            users: [this.currentDataCollector]
          });
          // send data to the end points
          this.formData = this.entityViewFilterGroup.value;
          this.entityViewFiltersService.createEntityViewFilter(this.formData).subscribe(res => {
            const parameters = new HttpParams()
              .set('id', res['id'])
              .set('users', this.formData.users);
            this.entityViewFiltersService.saveUserEntityViewFilter(parameters).subscribe(data => {
              this.router.navigate(['/entityViewFilter']);
              this.alertService.success(`${this.formData.name} has been successfully created `);
            });
          }, error => {
            this.alertService.error(`${this.formData.name} could not be created`);
          });

          console.log(results?.viewQuery, 'full query');
        }, error => console.log(error));

      });


      // creating acls after creating the partner
      // assigning conditional queries for forms and entities
      this.formConditionalQuery = `where cluster =` + '"' + programPartner['cluster'] + '"';
      this.entityConditionalQuery = 'where _cluster = ' + '"' + programPartner['cluster'] + '"';

      const queryArray = [];
      // loop through form and entity arrays and create objects and push to queryArray
      for (const form of this.formNames) {
        console.log(form);
        const obj = {};
        obj['form'] = form;
        obj['groupConditionQuery'] = this.formConditionalQuery;
        queryArray.push(obj);
      }
      for (const form of this.entityNames) {
        console.log(form);
        const obj = {};
        obj['form'] = form;
        obj['groupConditionQuery'] = this.entityConditionalQuery;
        queryArray.push(obj);
      }

      //  make the form group
      this.aclsFormGroup = this.formBuilder.group({
        group: [this.createdGroupId],
        permissions: [1],
        queryArray: [queryArray],
      });
      console.log(queryArray, 'querry array');
      console.log(this.aclsFormGroup.value, 'acls form group values');

      // create acls
      this.aclGroupMappingService.createGroupMapping2(this.aclsFormGroup.value).subscribe((acl) => {
        console.warn(acl, 'ACL created Successfully');
        this.alertService.success(`ACL has been created`);
      }, error => {
        this.alertService.error('Failed to Create the ACL');
      });
    }, error => {
      this.alertService.error('Failed to Create the Group');
    });

    if (this.formGroup.valid) {
      setTimeout(() => {
        this.formGroup.reset();
        this.submitted = false;
        this.router.navigate(['/programPartner']);
      }, 100);
    }
  }

  onSelectCountry(country) {
    this.countriesService.getCitiesForCountry(country).subscribe((response) => {
      this.cities = response.data;
    }, error => console.log(error));
  }

  onReset() {
    // this.formGroup.reset();
    this.router.navigate(['/programPartner']);
  }

  addOrganization() {
    if (this.organisationsInvolved.length < 5) {
      const id = uuid();
      this.organisationsInvolved.push({id: id, name: '', contact: ''});
    }
  }

  validateNumber(value) {
    this.inValidNumber = Validator.telephoneNumber(value);
  }

  cellEditor(rowId, tdId, key: string, oldValue, type?: string) {
    new CellEdit().edit(rowId, tdId, oldValue, key, this.saveCellValue, type);
  }

  saveCellValue = (value: string, key: string, rowId): void => {
    if (value !== null && value !== undefined) {
      switch (key) {
        case 'orgName':
          if (this.organisationsInvolved.some(x => x.id === rowId)) {
            this.organisationsInvolved.forEach(function (item) {
              if (item.id === rowId) {
                item.name = value;
              }
            });
          }
          break;
        case 'orgContact':
          if (this.organisationsInvolved.some(x => x.id === rowId)) {
            this.organisationsInvolved.forEach(function (item) {
              if (item.id === rowId) {
                item.contact = value;
              }
            });
          }
          break;
      }
    }
  }

}
