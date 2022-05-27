import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountriesService} from "../../services/countries.service";
import {FileUploadService} from "../../services/file-upload.service";
import {GrantProcessService} from "../../services/grant-process.service";
import {Router} from "@angular/router";
import {AlertService} from "../../services/alert";

@Component({
  selector: 'grant-report',
  templateUrl: './grant-report.component.html',
  styleUrls: ['./grant-process.component.css']
})

export class GrantReportComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @Input() grantId: string;
  @Input() processInstanceId: string;
  @Input() definitionKey: string;
  @Output() statusChanged: EventEmitter<string> = new EventEmitter();

  formGpReport: FormGroup;
  submitted = false;
  loading: boolean;

  status = 'completed';

  error: boolean;
  success: boolean;
  errorMessage: string;
  successMessage: string;

  constructor(
    private router: Router,
    private countriesService: CountriesService,
    private formBuilder: FormBuilder,
    public fileUploadService: FileUploadService,
    private grantProcessService: GrantProcessService,
    private alertService: AlertService
  ) {
  }

  get f() {
    return this.formGpReport?.controls;
  }

  ngOnInit(): void {

    if (!this.isReadOnly) {
      this.setEmptyForm()
    } else {
      this.grantProcessService.getGrantReport(this.grantId).subscribe((data: any) => {
        if (data != null) {
          this.formGpReport = this.formBuilder.group({
            grantAmount: [{value: data.grantAmount, disabled: this.isReadOnly}, [Validators.required]],
            grantAmountUtilised: [{value: data.grantAmountUtilised, disabled: this.isReadOnly}, [Validators.required]],
            amountTransferred: [{value: data.amountTransferred, disabled: this.isReadOnly}],
            balance: [{value: data.balance, disabled: this.isReadOnly}, [Validators.required]],
            periodFrom: [{value: data.periodFrom, disabled: this.isReadOnly}, [Validators.required]],
            periodTo: [{value: data.periodTo, disabled: this.isReadOnly}, [Validators.required]],
            reportAttachment: [{value: data.reportAttachment, disabled: this.isReadOnly}, [Validators.required]],
            grantId: [{value: data.grantId, disabled: this.isReadOnly}],
            processInstanceId: [{value: data.processInstanceId, disabled: this.isReadOnly}],
            definitionKey: [{value: data.definitionKey, disabled: this.isReadOnly}],
            status: [data.status],
          });
        }
      }, error=>{console.log(error)})
    }
  }

  setEmptyForm() {
    this.formGpReport = this.formBuilder.group({
      grantAmount: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      grantAmountUtilised: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      amountTransferred: [{value: '', disabled: this.isReadOnly}],
      balance: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      periodFrom: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      periodTo: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      reportAttachment: [{value: '', disabled: this.isReadOnly}, [Validators.required]],
      grantId: [{value: '', disabled: this.isReadOnly}],
      processInstanceId: [{value: '', disabled: this.isReadOnly}],
      definitionKey: [{value: '', disabled: this.isReadOnly}],
      status: [null],
    });
  }

  submitReport() {
    this.submitted = true;
    if (this.formGpReport.invalid) {
      this.alertService.error("Please fill in all fields correctly");
      return;
    }
    const formData = this.formGpReport.value;
    console.log('formData', formData)

    this.grantProcessService.createGrantReport(formData).subscribe(data => {
      console.log(data)
      this.submitted = true
      this.error = false;
      this.success = true;
      this.successMessage = "Saved Report";
      this.alertService.success(this.successMessage);
      this.statusChanged.emit(this.status);
    }, error => {
      this.error = true;
      this.success = false;
      this.errorMessage = "Failed to save Report";
      this.alertService.error(this.errorMessage);
      console.log(error);
    });
    setTimeout(() => {
      if (this.success == true) {
        (document.getElementById('reportAttachment') as HTMLInputElement).value = ''
        this.formGpReport.reset()
        this.onBackPressed()
      }
      this.success = false;
      this.error = false;
    }, 3000);
  }

  handleFileInput(event) {
    let files: FileList = event.target.files;
    this.uploadFile(files.item(0), event.target.id);
  }

  uploadFile(file, id) {
    this.loading = !this.loading;
    console.log(file);
    this.fileUploadService.upload(file).subscribe((data) => {
        if (id === "reportAttachment") this.formGpReport.patchValue({reportAttachment: data.path});
        this.loading = false;
      }, error => {
        console.log(error);
      }
    );
  }


  saveDraft(){
    this.status = 'draft'
    this.submitReport()
  }

  cancel() {
    (document.getElementById('reportAttachment') as HTMLInputElement).value = ''
    this.formGpReport.reset()
    this.submitted = false
  }

  onBackPressed() {
    this.router.navigate(['/taskList']);
  }
}
