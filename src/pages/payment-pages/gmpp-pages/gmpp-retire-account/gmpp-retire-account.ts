import { Component } from "@angular/core";
import { IonicPage, NavController, ModalController, Events } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import { Storage } from "@ionic/storage";
import { Item, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-gmpp-retire-account",
  templateUrl: "gmpp-retire-account.html"
})
export class GmppRetireAccountPage {
  // consumerIdentifier: any;
  private todo: FormGroup;
  private complate: FormGroup;
  public wallets: Item[];
  submitAttempt: boolean = false;
  public compleate: any = "FALSE";
  public GetServicesProvider: GetServicesProvider;

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    public navCtrl: NavController,
    public storage: Storage,
    public alertProvider: AlertProvider,
    public storageProvider: StorageProvider,
    public modalCtrl: ModalController
  ) {
    // this.storage.get("username").then(val => {
    //   this.consumerIdentifier = val;
    // });

    //  this.compleate='TRUE';
    //console.log(this.compleate);
    this.GetServicesProvider = GetServicesProviderg;

    

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

  ionViewWillEnter() {
    this.subscribeToDataChanges();
    this.loadWallets();
  }

  loadWallets() {
    this.storageProvider.getWallets().then(wallets => {
      this.wallets = wallets;
      if (!this.wallets || this.wallets.length <= 0) {
        
      }
    });
  }

  subscribeToDataChanges() {
    this.events.subscribe("data:updated", () => {
      this.todo.reset();
      this.loadWallets();
    });
  }

  

  Cancle() {
    this.storage.set("RetireACCOUNT", "FALSE");
    this.storage.set("RUUID", null);
    this.compleate = "FALSE";
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
      dat.consumerIdentifier = this.wallets[0].walletNumber;

      dat.isConsumer = "true";

      this.GetServicesProvider.load(this.todo.value, "Retirewallet").then(
        data => {
          if (data != null && data.responseCode == 1) {
            this.storage.set("RetireACCOUNT", "TRUE");
            this.storage.set("RUUID", dat.UUID);
            //   this.storage.set("primaryAccountNumber",dat.primaryAccountNumber);
            loader.dismiss();
            this.compleate = "TRUE";
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
            this.alertProvider.showAlert(data);
          }
        }
      );
    }
  }

  ComplateForm() {
    this.submitAttempt = true;
    if (this.complate.valid) {
      let loader = this.loadingCtrl.create();
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
          dat.consumerIdentifier = this.wallets[0].walletNumber;
          //console.log(dat.originalTranUUID)

          this.GetServicesProvider.load(
            this.complate.value,
            "ComplateRetirewallet"
          ).then(data => {
            if (data != null && data.responseCode == 1) {
              loader.dismiss();
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
              this.alertProvider.showAlert(data);
            }
          });
        }
      });
    }
  }
}
