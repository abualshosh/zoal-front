import { Component } from "@angular/core";
import { IonicPage, NavController, ModalController } from "ionic-angular";

import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";

import * as uuid from "uuid";

import { Storage } from "@ionic/storage";
import * as moment from "moment";
import { Wallet, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-gmpp-tran-to-card",
  templateUrl: "gmpp-tran-to-card.html"
})
export class GmppTranToCardPage {
  // consumerIdentifier: any;
  private todo: FormGroup;
  public wallets: Wallet[];
  submitAttempt: boolean = false;
  public GetServicesProvider: GetServicesProvider;

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    

    public storage: Storage,
    public alertProvider: AlertProvider,
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
      transactionAmount: ["", Validators.required],
      consumerPIN: ["", Validators.required]
    });
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

  

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      let loader = this.loadingCtrl.create();
      loader.present();
      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.consumerIdentifier = dat.walletNumber;
      dat.consumerPIN = this.GetServicesProvider.encryptGmpp(
        dat.UUID + dat.consumerPIN
      );

      
      dat.isConsumer = "true";

      this.GetServicesProvider.load(
        this.todo.value,
        "gmpp/transferWalletToAccount"
      ).then(data => {
        
        if (data != null && data.responseCode == 1) {
          loader.dismiss();
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );

          var datas = {
            destinationIdentifier: data.destinationIdentifier,
            fee: data.fee,
            externalFee: data.externalFee,
            transactionAmount: data.transactionAmount,
            totalAmount: data.totalAmount,
            transactionId: data.transactionId,
            date: datetime
          };
          var dat = [];
          var main = [];
          var mainData = {
            transferFromWalletToCard: data.totalAmount
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
          this.alertProvider.showAlert(data);
          this.todo.reset();
          this.submitAttempt = false;
        }
      });
    }
  }
}
