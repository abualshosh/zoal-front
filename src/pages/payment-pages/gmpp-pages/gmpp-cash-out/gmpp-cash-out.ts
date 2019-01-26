import { Component } from "@angular/core";
import { IonicPage, NavController, ModalController } from "ionic-angular";

import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import { AlertController } from "ionic-angular";
import * as uuid from "uuid";
import { UserProvider } from "../../../../providers/user/user";
import { Storage } from "@ionic/storage";
import * as moment from "moment";
import { Wallet, StorageProvider } from "../../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-gmpp-cash-out",
  templateUrl: "gmpp-cash-out.html"
})
export class GmppCashOutPage {
  // consumerIdentifier: any;
  private todo: FormGroup;
  public wallets: Wallet[];
  submitAttempt: boolean = false;

  public GetServicesProvider: GetServicesProvider;

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    public alertCtrl: AlertController,
    public user: UserProvider,
    public storage: Storage,
    public storageProvider: StorageProvider,
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) {
    // this.consumerIdentifier = "249" + localStorage.getItem("username");
    this.GetServicesProvider = GetServicesProviderg;

    this.storageProvider.getItems().then(wallets => {
      this.wallets = wallets;
      if (!this.wallets || this.wallets.length <= 0) {
        this.noWalletAvailable();
      }
    });

    this.todo = this.formBuilder.group({
      walletNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
          Validators.pattern("[249].[0-9]*")
        ])
      ],
      cashOutAll: [, ""],
      transactionAmount: ["", Validators.required],
      consumerPIN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ]
    });
    this.todo.controls["cashOutAll"].setValue(false);
  }

  noWalletAvailable() {
    this.navCtrl.pop();
    let modal = this.modalCtrl.create(
      "WalkthroughModalPage",
      {},
      { cssClass: "inset-modals" }
    );
    modal.present();
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

  CASHOUT(e) {
    this.todo.controls["cashOutAll"].setValue(
      !this.todo.controls["cashOutAll"].value
    );
  }

  logForm() {
    //console.log(this.todo.controls['cashOutAll'].value)
    //console.log(this.todo.controls['transactionAmount'].value)
    if (this.todo.controls["cashOutAll"].value) {
      this.todo.controls["transactionAmount"].setValue(0);
    }
    this.submitAttempt = true;
    if (this.todo.valid) {
      let loader = this.loadingCtrl.create();
      loader.present();
      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.consumerPIN = this.GetServicesProvider.encryptGmpp(
        dat.UUID + dat.consumerPIN
      );
      dat.consumerIdentifier = dat.walletNumber;
      //console.log(dat.IPIN)
      dat.isConsumer = "true";

      this.GetServicesProvider.load(
        this.todo.value,
        "gmpp/doCashOutWithTan"
      ).then(data => {
        //console.log(data)
        if (data != null && data.responseCode == 1) {
          loader.dismiss();
          // this.showAlert(data);
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );

          var datas = {
            destinationIdentifier: data.destinationIdentifier,
            tan: data.tan,

            fee: data.fee,
            transactionAmount: data.transactionAmount,
            totalAmount: data.totalAmount,
            transactionId: data.transactionId,
            date: datetime
          };
          var dat = [];
          var main = [];
          var mainData = {
            cashOut: data.totalAmount
          };
          dat.push({ WalletNumber: data.consumerIdentifier });
          main.push(mainData);
          dat.push(datas);
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
          this.showAlert(data);
          this.todo.reset();
          this.submitAttempt = false;
        }
      });
      dat.consumerPIN = null;
    }
  }
}
