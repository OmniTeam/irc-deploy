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
  @Input() isMakeCorrections: boolean;
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
  negativeBalance: boolean;

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

    if (this.isReadOnly || this.isMakeCorrections) {
      let disabled = this.isReadOnly
      if(this.isMakeCorrections) disabled = false
      this.grantProcessService.getGrantReport(this.grantId).subscribe((data: any) => {
        if (data != null) {
          this.formGpReport = this.formBuilder.group({
            grantAmount: [{value: data.grantAmount, disabled: disabled}, [Validators.required]],
            grantAmountUtilised: [{value: data.grantAmountUtilised, disabled: disabled}, [Validators.required]],
            dateReportSubmitted: [{value: data.dateReportSubmitted, disabled: disabled}, [Validators.required]],
            amountTransferred: [{value: data.amountTransferred, disabled: disabled}],
            balance: [{value: data.balance, disabled: true}, [Validators.required]],
            periodFrom: [{value: data.periodFrom, disabled: disabled}, [Validators.required]],
            periodTo: [{value: data.periodTo, disabled: disabled}, [Validators.required]],
            reportAttachment: [{value: data.reportAttachment, disabled: disabled}, [Validators.required]],
            grantId: [{value: data.grantId, disabled: disabled}],
            processInstanceId: [{value: data.processInstanceId, disabled: disabled}],
            definitionKey: [{value: data.definitionKey, disabled: disabled}],
            status: [data.status],
          });
        }
      }, error => {
        console.log(error)
      })
    } else this.setEmptyForm()
  }

  setEmptyForm() {
    this.formGpReport = this.formBuilder.group({
      grantAmount: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      grantAmountUtilised: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      dateReportSubmitted: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      balance: [{value: null, disabled: true}, [Validators.required]],
      periodFrom: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      periodTo: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      reportAttachment: [{value: null, disabled: this.isReadOnly}, [Validators.required]],
      grantId: [{value: null, disabled: this.isReadOnly}],
      processInstanceId: [{value: null, disabled: this.isReadOnly}],
      definitionKey: [{value: null, disabled: this.isReadOnly}],
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
      this.successMessage = "Report Submitted Successfully";
      this.alertService.success(this.successMessage);
      this.statusChanged.emit(this.status);
    }, error => {
      this.error = true;
      this.success = false;
      this.errorMessage = "Failed to submit Report";
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

  calculateBalance() {
    this.negativeBalance = false
    let balance = +this.f.grantAmount.value - +this.f.grantAmountUtilised.value
    this.formGpReport.patchValue({balance: balance});
    if (balance < 0) this.negativeBalance = true
  }

  saveDraft() {
    this.status = 'draft'
    this.submitReport()
  }

  cancel() {
    (document.getElementById('reportAttachment') as HTMLInputElement).value = ''
    this.formGpReport.reset()
    this.submitted = false
  }

  onBackPressed() {
    this.router.navigate(['/home']);
  }
}
