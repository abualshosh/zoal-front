import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ViewController
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { AlertProvider } from "../../../providers/alert/alert";
import { Api } from "../../../providers/api/api";

@IonicPage()
@Component({
  selector: "page-contact-us",
  templateUrl: "contact-us.html"
})
export class ContactUsPage {
  private contactForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public api: Api,
    public navParams: NavParams
  ) {
    this.contactForm = this.formBuilder.group({
      title: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(30)])
      ],
      message: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(200)])
      ]
    });
  }

  clearInput() {
    this.contactForm.controls["title"].reset();
    this.contactForm.controls["message"].reset();
  }

  sendMessage() {
    this.submitAttempt = true;

    if (this.contactForm.valid) {
      this.alertProvider.showLoading();

      let request = this.contactForm.value;
      this.api.post("user-messages", request).subscribe(
        res => {
          this.alertProvider.hideLoading();
          this.alertProvider.showToast("companyContactSuccess");
          this.contactForm.reset();
          this.submitAttempt = false;
          this.cancel();
        },
        err => {
          this.alertProvider.hideLoading();
          this.contactForm.reset();
          this.alertProvider.showAlert(err);
          this.submitAttempt = false;
        }
      );
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
}
