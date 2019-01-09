import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import * as moment from "moment";

import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import { AlertController } from "ionic-angular";
import * as NodeRSA from "node-rsa";
import * as uuid from "uuid";
import { UserProvider } from "../../../../providers/user/user";
import { Storage } from "@ionic/storage";
import { Card } from "../../../../models/cards";

@IonicPage()
@Component({
  selector: "page-electricity-services",
  templateUrl: "electricity-services.html"
})
export class ElectricityServicesPage {
  profile: any;
  private bal: any;
  private todo: FormGroup;
  public cards: Card[] = [];
  public payee: any[] = [];
  public title: any;
  showWallet: boolean = false;
  submitAttempt: boolean = false;
  validCard: boolean = false;
  isGmpp: boolean;
  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProvider: GetServicesProvider,
    public alertCtrl: AlertController,
    public user: UserProvider,
    public storage: Storage,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.storage.get("cards").then(val => {
      this.cards = val;
      // if (this.cards) {
      //   if (this.cards.length <= 0) {
      //     this.showWallet = true;
      //     this.todo.controls["mobilewallet"].setValue(true);
      //   }
      // } else {
      //   this.showWallet = true;
      //   this.todo.controls["mobilewallet"].setValue(true);
      // }
      this.isGmpp = this.navParams.get("isGmpp");
      if (this.isGmpp) {
        this.showWallet = true;
        this.todo.controls["mobilewallet"].setValue(true);
      } else {
        this.showWallet = false;
        this.todo.controls["mobilewallet"].setValue(false);
      }
    });
    this.title = this.navParams.get("name");

    //user.printuser();

    this.todo = this.formBuilder.group({
      pan: [""],
      Card: [""],
      entityId: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
          Validators.pattern("[249][0-9]*")
        ])
      ],
      Payee: [""],
      mobilewallet: [""],
      IPIN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ],
      METER: ["", Validators.required],
      Amount: ["", Validators.required]
    });
    this.todo.controls["mobilewallet"].setValue(false);
    // this.todo.controls["entityId"].setValue(
    //   "249" + localStorage.getItem("username")
    // );
  }

  clearInput() {
    this.todo.controls["pan"].reset();
    this.todo.controls["Card"].reset();
    this.todo.controls["entityId"].reset();
    this.todo.controls["Payee"].reset();
    this.todo.controls["IPIN"].reset();
    this.todo.controls["METER"].reset();
    this.todo.controls["Amount"].reset();
    if (this.cards) {
      if (this.cards.length <= 0) {
        this.showWallet = true;
        this.todo.controls["mobilewallet"].setValue(true);
      }
    } else {
      this.showWallet = true;
      this.todo.controls["mobilewallet"].setValue(true);
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

  WalletAvalible(event) {
    this.profile = JSON.parse(localStorage.getItem("profile"));
    // if (!this.profile.phoneNumber) {
    //   let modal = this.modalCtrl.create(
    //     "GmppSignupModalPage",
    //     {},
    //     { cssClass: "inset-modals" }
    //   );
    //   modal.present();
    //   this.todo.reset();

    //   this.showWallet = true;
    // } else
    if (this.cards) {
      if (this.cards.length <= 0) {
        this.showWallet = true;
        let modal = this.modalCtrl.create(
          "AddCardModalPage",
          {},
          { cssClass: "inset-modals" }
        );
        modal.present();
      }
    } else {
      this.showWallet = true;

      let modal = this.modalCtrl.create(
        "AddCardModalPage",
        {},
        { cssClass: "inset-modals" }
      );
      modal.present();
    }
  }

  onSelectChange(selectedValue: any) {
    var dat = this.todo.value;
    if (dat.Card && !dat.mobilewallet) {
      this.validCard = true;
    }
  }
  logForm() {
    var dat = this.todo.value;
    if (dat.Card && !dat.mobilewallet) {
      this.validCard = true;
    }
    this.submitAttempt = true;
    if (this.todo.valid) {
      if (!dat.mobilewallet && !this.validCard) {
        return;
      }
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.IPIN = this.GetServicesProvider.encrypt(dat.UUID + dat.IPIN);
      //console.log(dat.IPIN)
      dat.tranCurrency = "SDG";

      dat.tranAmount = dat.Amount;
      if (dat.mobilewallet) {
        dat.entityType = "Mobile Wallet";

        dat.authenticationType = "10";
        dat.pan = "";
      } else {
        dat.pan = dat.Card.pan;
        dat.expDate = dat.Card.expDate;
        dat.authenticationType = "00";
        dat.entityId = "";
      }
      dat.fromAccountType = "00";
      dat.toAccountType = "00";

      dat.paymentInfo = "METER=" + dat.METER;
      dat.payeeId = "National Electricity Corp.";

      //console.log(dat)
      this.GetServicesProvider.load(dat, "consumer/payment").then(data => {
        this.bal = data;
        //console.log(data)
        if (data != null && data.responseCode == 0) {
          loader.dismiss();
          // this.showAlert(data);
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );
          var datas;

          let token = null;
          if (Object.keys(data.billInfo).length > 0) {
            token = data.billInfo.token;
          }
          datas = {
            acqTranFee: data.acqTranFee,
            issuerTranFee: data.issuerTranFee,
            tranAmount: data.tranAmount,
            tranCurrency: data.tranCurrency,
            date: datetime
          };

          var dat = [];
          if (data.PAN) {
            dat.push({ token: token, Card: data.PAN });
          } else {
            dat.push({ WalletNumber: data.entityId });
          }
          var main = [];
          var mainData = {
            NEC: data.tranAmount
          };
          main.push(mainData);

          if (Object.keys(data.billInfo).length > 0) {
            data.billInfo.opertorMessage = null;
            data.billInfo.accountNo = null;
            data.billInfo.token = null;
            dat.push(data.billInfo);
          }
          dat.push(datas);
          let modal = this.modalCtrl.create(
            "TransactionDetailPage",
            { data: dat, main: main },
            { cssClass: "inset-modal" }
          );
          modal.present();
          this.clearInput();
          this.submitAttempt = false;
          // this.todo.controls["entityId"].setValue(
          //   "0" + localStorage.getItem("username")
          // );
        } else {
          loader.dismiss();
          this.showAlert(data);
          this.clearInput();
          this.submitAttempt = false;
          // this.todo.controls["entityId"].setValue(
          //   "0" + localStorage.getItem("username")
          // );
        }
      });
    }
  }
}
