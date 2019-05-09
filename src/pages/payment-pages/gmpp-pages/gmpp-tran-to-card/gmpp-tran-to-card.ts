import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ModalController,
  Events
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import * as moment from "moment";
import { Item, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-gmpp-tran-to-card",
  templateUrl: "gmpp-tran-to-card.html"
})
export class GmppTranToCardPage {
  // consumerIdentifier: any;
  private todo: FormGroup;
  public wallets: Item[];
  submitAttempt: boolean = false;
  public GetServicesProvider: GetServicesProvider;

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public GetServicesProviderg: GetServicesProvider,
    public alertProvider: AlertProvider,
    public storageProvider: StorageProvider,
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) {
    // this.consumerIdentifier = "249" + localStorage.getItem("username");

    this.GetServicesProvider = GetServicesProviderg;

    this.todo = this.formBuilder.group({
      transactionAmount: ["", Validators.required],
      consumerPIN: ["", Validators.required]
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
      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.consumerIdentifier = this.wallets[0].walletNumber;
      dat.consumerPIN = this.GetServicesProvider.encryptGmpp(
        dat.UUID + dat.consumerPIN
      );

      dat.isConsumer = "true";

      this.GetServicesProvider.doTransaction(
        this.todo.value,
        "gmpp/transferWalletToAccount"
      ).subscribe(data => {
        if (data != null && data.responseCode == 1) {
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
          this.alertProvider.showAlert(data);
          this.todo.reset();
          this.submitAttempt = false;
        }
      });
    }
  }
}
