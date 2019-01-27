import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { GetServicesProvider } from "../../../providers/providers";
import { AlertProvider } from "../../../providers/alert/alert";

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
    public loadingCtrl: LoadingController,
    public serviceProvider: GetServicesProvider,
    public alertProvider: AlertProvider,
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

  ionViewDidLoad() {}

  clearInput() {
    this.contactForm.controls["title"].reset();
    this.contactForm.controls["message"].reset();
  }

  sendMessage() {
    this.submitAttempt = true;

    if (this.contactForm.valid) {
      let loader = this.loadingCtrl.create({});
      loader.present();

      let request = this.contactForm.value;

      this.serviceProvider.load(request, "userMessages").then(
        res => {
          loader.dismiss();
          this.alertProvider.showAlert(res);
          this.submitAttempt = false;
        },
        err => {
          loader.dismiss();
          this.alertProvider.showAlert(err);
          this.submitAttempt = false;
        }
      );
    }
  }
}
