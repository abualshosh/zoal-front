import { Component } from "@angular/core";
import { IonicPage, NavController, ModalController } from "ionic-angular";

import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";

import * as uuid from "uuid";
import { UserProvider } from "../../../../providers/user/user";
import { Storage } from "@ionic/storage";
import { Wallet, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-gmpp-resend-tan",
  templateUrl: "gmpp-resend-tan.html"
})
export class GmppResendTanPage {
  // consumerIdentifier: any;
  private todo: FormGroup;
  public wallets: Wallet[];
  submitAttempt: boolean = false;
  public GetServicesProvider: GetServicesProvider;

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    
    public user: UserProvider,
    public storage: Storage,
    public alertProvider: AlertProvider,
    public storageProvider: StorageProvider,
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) {
    // this.storage.get("username").then(val => {
    //   this.consumerIdentifier = val;
    // });

    
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
      transactionId: ["", Validators.required],
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
      dat.consumerPIN = this.GetServicesProvider.encryptGmpp(
        dat.UUID + dat.consumerPIN
      );
      dat.consumerIdentifier = dat.walletNumber;
      
      dat.originatorType = "Consumer";
      dat.tranType = "CASHOUT";
      this.GetServicesProvider.load(this.todo.value, "ResendTan").then(data => {
        
        if (data != null && data.responseCode == 1) {
          loader.dismiss();
          var datas = [{ tital: "Status", desc: data.responseMessage }];
          let modal = this.modalCtrl.create(
            "GmppReceiptPage",
            { data: datas },
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
