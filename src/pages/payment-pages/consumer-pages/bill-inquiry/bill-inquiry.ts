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

import { Storage } from "@ionic/storage";
import { Card } from "../../../../models/cards";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-bill-inquiry",
  templateUrl: "bill-inquiry.html"
})
export class BillInquiryPage {
  submitAttempt: boolean = false;
  private todo: FormGroup;
  public cards: Card[] = [];
  public payee: any[] = [];
  public title: any;

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProvider: GetServicesProvider,
    

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
      MPHONE: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern("[0-9]*")
        ])
      ]
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
      
      dat.tranCurrency = "SDG";
      dat.mbr = "1";
      dat.tranAmount = dat.Amount;
      dat.toCard = dat.ToCard;
      dat.authenticationType = "00";
      dat.fromAccountType = "00";
      dat.toAccountType = "00";
      dat.paymentInfo = "MPHONE=" + dat.MPHONE;
      dat.payeeId = this.navParams.get("title");
      dat.pan = dat.Card.pan;
      dat.expDate = dat.Card.expDate;
      
      this.GetServicesProvider.load(dat, "Billquiry").then(data => {
        
        if (data != null && data.responseCode == 0) {
          loader.dismiss();
          var dat = [];

          dat.push(data.billInfo);
          let modal = this.modalCtrl.create(
            "TransactionDetailPage",
            { data: dat },
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
