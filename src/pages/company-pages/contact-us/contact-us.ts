import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ModalController
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { GetServicesProvider } from "../../../providers/providers";
import { AlertProvider } from "../../../providers/alert/alert";
import * as moment from "moment";
import { StorageProvider } from "../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-contact-us",
  templateUrl: "contact-us.html"
})
export class ContactUsPage {
  private contactForm: FormGroup;
  submitAttempt: boolean = false;
  profile: any;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public serviceProvider: GetServicesProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public storageProvider: StorageProvider,
    public navParams: NavParams
  ) {
    this.storageProvider.getProfile().subscribe(val => {
      this.profile = val;
    });

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
      request.userName = this.profile.userName;
      request.date = moment().format("YYYY-MM-DD HH:MM:SS");

      this.serviceProvider.load(request, "consumer/user-messages").then(
        res => {
          loader.dismiss();
          let modal = this.modalCtrl.create(
            "TransactionDetailPage",
            { data: [], main: [{ contactUsPage: "" }] },
            { cssClass: "inset-modals" }
          );
          modal.present();
          this.contactForm.reset();
          this.submitAttempt = false;
        },
        err => {
          loader.dismiss();
          this.contactForm.reset();
          this.alertProvider.showAlert(err);
          this.submitAttempt = false;
        }
      );
    }
  }
}
