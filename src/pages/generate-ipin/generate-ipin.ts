import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";

import * as uuid from "uuid";
import { GetServicesProvider } from "../../providers/get-services/get-services";
import { AlertProvider } from "../../providers/alert/alert";
import { Item, StorageProvider } from "../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-generate-ipin",
  templateUrl: "generate-ipin.html"
})
export class GenerateIpinPage {
  private generateIpinForm: FormGroup;
  private completeForm: FormGroup;
  public cards: Item[] = [];
  public isComplete: boolean = false;
  public submitAttempt: boolean = false;
  pan: any;
  expDate: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    public getServicesProvider: GetServicesProvider,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider
  ) {
    this.storageProvider.getCards().then(cards => {
      this.cards = cards;
    });

    this.generateIpinForm = this.formBuilder.group({
      card: ["", Validators.required],
      phoneNumber: [
        "",
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern("0[0-9]*")
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

  submit() {
    this.submitAttempt = true;
    if (this.generateIpinForm.valid) {
      let requestData = this.generateIpinForm.value;
      requestData.UUID = uuid.v4();
      requestData.phoneNumber =
        "249" +
        requestData.phoneNumber.substring(1, requestData.phoneNumber.length);
      requestData.pan = requestData.card.cardNumber;
      requestData.expDate = requestData.card.expDate;
      this.pan = requestData.card.cardNumber;
      this.expDate = requestData.card.expDate;

      this.getServicesProvider
        .doTransaction(requestData, "ipinGeneration/generateIpin")
        .subscribe(
          res => {
            if (res != null && res.responseCode == 100) {
              this.isComplete = true;
              this.submitAttempt = false;
            } else {
              this.alertProvider.showAlert(res);
              this.isComplete = false;
              this.clearInput("generateIpinForm");
              this.submitAttempt = false;
            }
          },
          err => {
            this.alertProvider.showAlert(err);
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
      let requestData = this.completeForm.value;
      requestData.UUID = uuid.v4();
      requestData.pan = this.pan;
      requestData.expDate = this.expDate;
      requestData.ipin = this.getServicesProvider.encryptIpin(
        requestData.UUID + requestData.ipin
      );
      requestData.otp = this.getServicesProvider.encryptIpin(
        requestData.UUID + requestData.otp
      );

      this.getServicesProvider
        .doTransaction(requestData, "ipinGeneration/generateIpinCompletion")
        .subscribe(
          res => {
            if (res != null && res.responseCode == 100) {
              this.isComplete = false;
              this.submitAttempt = false;
              this.alertProvider.showToast("ipinGenerationSuccess");
              this.navCtrl.pop();
            } else {
              this.alertProvider.showAlert(res);
              this.clearInput("completeForm");
              this.submitAttempt = false;
            }
          },
          err => {
            this.alertProvider.showAlert(err);
            this.clearInput("completeForm");
            this.submitAttempt = false;
          }
        );
    }
  }
}
