import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EntityService} from "../../../services/entity.service";
import {AlertService} from "../../../services/alert";

@Component({
  selector: 'app-edit-entities',
  templateUrl: './edit-entities.component.html',
  styleUrls: ['./edit-entities.component.css']
})
export class EditEntitiesComponent implements OnInit {

  formGroup: FormGroup;
  submitted = false;
  formData: any;
  enableButtons: true;
  entries: number = 10;
  selected: any[] = [];
  activeRow: any;
  rows: Object[];
  entityId: any;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private entityService: EntityService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.entityId = this.route.snapshot.params.id;
    this.entityService.getCurrentEntity(this.entityId).subscribe((results: any) => {
      this.formGroup = this.formBuilder.group({
        name: [results?.name, [Validators.required]],
        prefix: [{value: results?.prefix, disabled: true}, [Validators.required]],
        enableTagging: [{value: results?.enableTagging, disabled: true}, [Validators.required]],
      });
      if (results['entityFields'].length > 0) {
        this.rows = results['entityFields'];
      }
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  editEntity() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    } else {
      this.formData = this.formGroup.value;
      this.entityService.updateEntity(this.entityId, this.formData).subscribe((data) => {
        this.alertService.success(`${this.formData.name} has been updated successfully`);
        this.router.navigate(['/entity']);
      }, error => {
        this.alertService.error(`${this.formData.name} has not been successfully updated`);
      });
    }
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value;
    this.rows = this.rows.filter(function (d) {
      for (let key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  onCancel() {
    window.history.back();
  }

}
