import { Component } from "@angular/core";
import { IonicPage, NavController, ModalController } from "ionic-angular";

import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import { AlertController } from "ionic-angular";
import * as uuid from "uuid";
import { UserProvider } from "../../../../providers/user/user";
import { Storage } from "@ionic/storage";
import { Wallet, StorageProvider } from "../../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-gmpp-retire-account",
  templateUrl: "gmpp-retire-account.html"
})
export class GmppRetireAccountPage {
  // consumerIdentifier: any;
  private todo: FormGroup;
  private complate: FormGroup;
  public wallets: Wallet[];
  submitAttempt: boolean = false;
  public compleate: any = "FALSE";
  public GetServicesProvider: GetServicesProvider;

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public user: UserProvider,
    public storage: Storage,
    public storageProvider: StorageProvider,
    public modalCtrl: ModalController
  ) {
    // this.storage.get("username").then(val => {
    //   this.consumerIdentifier = val;
    // });

    //user.printuser();
    //  this.compleate='TRUE';
    //console.log(this.compleate);
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
      retireReason: ["", Validators.required],
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

    this.complate = this.formBuilder.group({
      consumerOTP: ["", Validators.required],
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

  ionViewDidLoad() {
    // this.storage.get("RUUID").then(val => {
    //   this.storage.set("RetireACCOUNT", "TRUE");
    //   this.storage.set("RUUID", "2711dbcd-0314-431b-8731-97266974f28d");
    // });
    this.storage.get("RetireACCOUNT").then(val => {
      if (val != null) {
        this.compleate = val;
      }
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

  Cancle() {
    this.storage.set("RetireACCOUNT", "FALSE");
    this.storage.set("RUUID", null);
    this.compleate = "FALSE";
  }

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.consumerPIN = this.GetServicesProvider.encryptGmpp(
        dat.UUID + dat.consumerPIN
      );
      dat.consumerIdentifier = dat.walletNumber;

      //console.log(dat.IPIN)
      dat.isConsumer = "true";

      this.GetServicesProvider.load(this.todo.value, "Retirewallet").then(
        data => {
          //console.log(data)
          if (data != null && data.responseCode == 1) {
            this.storage.set("RetireACCOUNT", "TRUE");
            this.storage.set("RUUID", dat.UUID);
            //   this.storage.set("primaryAccountNumber",dat.primaryAccountNumber);
            loader.dismiss();
            this.compleate = "TRUE";
            // this.showAlert(data);

            var datas = [
              { tital: "Status", desc: data.responseMessage },
              { tital: "SMS", desc: "An SMS will be sent shortly" }
            ];
            let modal = this.modalCtrl.create(
              "GmppReceiptPage",
              { data: datas },
              { cssClass: "inset-modal" }
            );
            modal.present();
            this.submitAttempt = false;
          } else {
            this.submitAttempt = false;
            loader.dismiss();
            this.showAlert(data);
          }
        }
      );
    }
  }

  ComplateForm() {
    this.submitAttempt = true;
    if (this.complate.valid) {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      var dat = this.complate.value;

      this.storage.get("RUUID").then(val => {
        if (val != null) {
          dat.originalTranUUID = val;

          dat.UUID = uuid.v4();
          dat.consumerPIN = this.GetServicesProvider.encrypt(
            dat.UUID + dat.consumerPIN
          );
          dat.consumerOTP = this.GetServicesProvider.encrypt(
            dat.UUID + dat.consumerOTP
          );
          dat.consumerIdentifier = this.todo.controls["walletNumber"].value;
          //console.log(dat.originalTranUUID)
          //console.log(dat.IPIN)

          this.GetServicesProvider.load(
            this.complate.value,
            "ComplateRetirewallet"
          ).then(data => {
            //console.log(data)
            if (data != null && data.responseCode == 1) {
              loader.dismiss();
              // this.showAlert(data);

              var datas = [{ tital: "Status", desc: data.responseMessage }];
              let modal = this.modalCtrl.create(
                "GmppReceiptPage",
                { data: datas },
                { cssClass: "inset-modal" }
              );
              modal.present();
              this.submitAttempt = false;
              this.Cancle();
            } else {
              this.submitAttempt = false;
              loader.dismiss();
              this.showAlert(data);
            }
          });
        }
      });
    }
  }
}
