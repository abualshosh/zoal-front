import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";

import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";

import * as uuid from "uuid";
import { UserProvider } from "../../../../providers/user/user";
import { Storage } from "@ionic/storage";
import { Card } from "../../../../models/cards";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-customs-inquiry",
  templateUrl: "customs-inquiry.html"
})
export class CustomsInquiryPage {
  private todo: FormGroup;
  public cards: Card[] = [];
  public payee: any[] = [];
  public title: any;

  submitAttempt: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProvider: GetServicesProvider,
    
    public user: UserProvider,
    public navCtrl: NavController,
    public storage: Storage,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.storage.get("cards").then(val => {
      this.cards = val;
      if (!this.cards || this.cards.length <= 0) {
        this.noCardAvailable();
      }
    });

    this.title = this.navParams.get("name");

    //user.printuser();

    this.todo = this.formBuilder.group({
      pan: [""],
      Card: ["", Validators.required],
      Payee: [""],
      IPIN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ],
      BANKCODE: ["", Validators.required],
      DECLARANTCODE: ["", Validators.required]
    });
  }

  noCardAvailable() {
    this.navCtrl.pop();
    let modal = this.modalCtrl.create(
      "AddCardModalPage",
      {},
      { cssClass: "inset-modals" }
    );
    modal.present();
  }

  

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      let loader = this.loadingCtrl.create();
      loader.present();
      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.IPIN = this.GetServicesProvider.encrypt(dat.UUID + dat.IPIN);
      //console.log(dat.IPIN)
      dat.tranCurrency = "SDG";

      dat.tranAmount = dat.Amount;
      dat.toCard = dat.ToCard;
      dat.authenticationType = "00";
      dat.fromAccountType = "00";
      dat.toAccountType = "00";
      dat.paymentInfo =
        "BANKCODE=" + dat.BANKCODE + "/DECLARANTCODE=" + dat.DECLARANTCODE;
      dat.payeeId = "0010030003";
      dat.PAN = dat.Card.pan;
      dat.expDate = dat.Card.expDate;
      //console.log(dat)
      this.GetServicesProvider.load(dat, "consumer/getBill").then(data => {
        //console.log(data)
        if (data != null && data.responseCode == 0) {
          loader.dismiss();
          var main = [];
          var mainData = {
            customsInquiryPage: data.billInfo.Amount
          };
          main.push(mainData);

          var dat = [];
          dat.push({ Card: data.PAN });
          dat.push(data.billInfo);
          console.log(data);
          let modal = this.modalCtrl.create(
            "TransactionDetailPage",
            { data: dat, main: main },
            { cssClass: "inset-modal" }
          );
          modal.present();
          this.todo.reset();
          this.submitAttempt = false;
        } else {
          loader.dismiss();
          this.alertProvider.showAlert(data);
          this.todo.reset();
          this.submitAttempt = false;
        }
      });
    }
  }
}
