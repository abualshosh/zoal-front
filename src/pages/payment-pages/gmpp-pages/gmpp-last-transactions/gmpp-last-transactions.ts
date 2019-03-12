import { Component } from "@angular/core";
import { IonicPage, NavController, ModalController, Events } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import { Item, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-gmpp-last-transactions",
  templateUrl: "gmpp-last-transactions.html"
})
export class GmppLastTransactionsPage {
  // consumerIdentifier: any;
  private todo: FormGroup;
  public submitAttempt = false;
  public wallets: Item[];

  public GetServicesProvider: GetServicesProvider;
  
  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    public alertProvider: AlertProvider,
    public storageProvider: StorageProvider,
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) {
    // this.consumerIdentifier = localStorage.getItem("username");

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

      this.GetServicesProvider.load(
        this.todo.value,
        "gmpp/getLastTransactions"
      ).then(data => {
        this.submitAttempt = false;

        if (data != null && data.responseCode == 1) {
          loader.dismiss();
          var datas = [
            { tital: "Status", desc: data.responseMessage },
            { tital: "available Balance", desc: data.availableBalance },
            { tital: "reserved Balance", desc: data.reservedBalance }
          ];
          let modal = this.modalCtrl.create(
            "LastTransactionsModelPage",
            { data: data.transactions },
            { cssClass: "inset-modal" }
          );
          modal.present();
          this.todo.reset();
          // this.submitAttempt=false;
        } else {
          this.submitAttempt = false;
          loader.dismiss();
          this.alertProvider.showAlert(data);
          this.todo.reset();
          //  this.submitAttempt=false;
        }
      });
      //  dat.consumerPIN=null;
    }
  }
}
