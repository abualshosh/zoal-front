import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { AlertController } from "ionic-angular";
import * as uuid from "uuid";
import { GetServicesProvider } from "../../providers/get-services/get-services";
import { Card } from "../../models/cards";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: "page-generate-ipin",
  templateUrl: "generate-ipin.html"
})
export class GenerateIpinPage {
  private generateIpinForm: FormGroup;
  private completeForm: FormGroup;
  public cards: Card[] = [];
  public isComplete: boolean = false;
  public submitAttempt: boolean = false;
  pan: any;
  expDate: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public getServicesProvider: GetServicesProvider,
    public storage: Storage,
    public alertCtrl: AlertController
  ) {
    this.storage.get("cards").then(cards => {
      this.cards = cards;
    });

    this.generateIpinForm = this.formBuilder.group({
      card: ["", Validators.required],
      phoneNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
          Validators.pattern("249[0-9]*")
        ])
      ]
    });

    this.completeForm = this.formBuilder.group({
      otp: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ],
      ipin: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ]
    });
  }

  ionViewDidLoad() {}

  clearInput(form) {
    if (form === "generateIpinForm") {
      this.generateIpinForm.controls["card"].reset();
      this.generateIpinForm.controls["phoneNumber"].reset();
    } else if (form === "completeForm") {
      this.completeForm.controls["otp"].reset();
      this.completeForm.controls["ipin"].reset();
    }
  }

  showAlert(data: any) {
    let message: any;
    if (data.responseCode != null) {
      message = data.responseMessage;
    } else {
      message = "Connection error";
    }
    let alert = this.alertCtrl.create({
      title: "ERROR",
      message: message,

      buttons: ["OK"],
      cssClass: "alertCustomCss"
    });
    alert.present();
  }

  submit() {
    this.submitAttempt = true;
    if (this.generateIpinForm.valid) {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();

      let requestData = this.generateIpinForm.value;
      requestData.UUID = uuid.v4();
      requestData.pan = requestData.card.pan;
      requestData.expDate = requestData.card.expDate;
      this.pan = requestData.card.pan;
      this.expDate = requestData.card.expDate;

      this.getServicesProvider
        .load(requestData, "IpinGeneration/generateIpin")
        .then(
          res => {
            if (res !== null && res.responseCode === 100) {
              loader.dismiss();

              this.isComplete = true;
              this.clearInput("generateIpinForm");
              this.submitAttempt = false;
            } else {
              loader.dismiss();
              this.showAlert(res);
              this.isComplete = false;
              this.clearInput("generateIpinForm");
              this.submitAttempt = false;
            }
          },
          err => {
            loader.dismiss();
            this.showAlert(err);
            this.isComplete = false;
            this.clearInput("generateIpinForm");
            this.submitAttempt = false;
          }
        );
    }
  }

  submitCompletion() {
    this.submitAttempt = true;
    if (this.completeForm.valid) {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();

      let requestData = this.completeForm.value;
      requestData.pan = this.pan;
      requestData.expDate = this.expDate;

      this.getServicesProvider
        .load(requestData, "IpinGeneration/generateIpinCompletion")
        .then(
          res => {
            if (res !== null && res.responseCode === 100) {
              loader.dismiss();

              this.isComplete = false;
              this.clearInput("completeForm");
              this.submitAttempt = false;
            } else {
              loader.dismiss();
              this.showAlert(res);
              this.clearInput("completeForm");
              this.submitAttempt = false;
            }
          },
          err => {
            loader.dismiss();
            this.showAlert(err);
            this.clearInput("completeForm");
            this.submitAttempt = false;
          }
        );
    }
  }
}
