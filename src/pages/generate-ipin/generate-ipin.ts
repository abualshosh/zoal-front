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
  public cards: Item[] = [];
  public isComplete: boolean = false;
  public submitAttempt: boolean = false;
  pan: any;
  expDate: any;

  isReadyToSave1: boolean;
  isReadyToSave2: boolean;

  generateIpinForm = this.formBuilder.group({
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

  completeForm = this.formBuilder.group({
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    public serviceProvider: GetServicesProvider,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider
  ) {
    this.storageProvider.getCards().subscribe(cards => {
      this.cards = cards.body;
    });

    this.generateIpinForm.valueChanges.subscribe(v => {
      this.isReadyToSave1 = this.generateIpinForm.valid;
    });

    this.completeForm.valueChanges.subscribe(v => {
      this.isReadyToSave2 = this.completeForm.valid;
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
      const form = this.generateIpinForm.value;
      const request = {
        UUID: uuid.v4(),
        phoneNumber:
          "249" + form.phoneNumber.substring(1, form.phoneNumber.length),
        pan: form.Card.pan,
        expDate: form.card.expDate
      };

      this.pan = form.Card.pan;
      this.expDate = form.card.expDate;

      this.serviceProvider
        .doTransaction(request, "ipinGeneration/generateIpin")
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
      const form = this.completeForm.value;
      const tranUuid = uuid.v4();
      const request = {
        UUID: tranUuid,
        pan: this.pan,
        expDate: this.expDate,
        ipin: this.serviceProvider.encryptIpin(tranUuid + form.ipin),
        otp: this.serviceProvider.encryptIpin(tranUuid + form.otp)
      };

      this.serviceProvider
        .doTransaction(request, "ipinGeneration/generateIpinCompletion")
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
