import { Component } from "@angular/core";
import {
  ViewController,
  IonicPage,
  ModalController,
  NavController,
  Events
} from "ionic-angular";
import { GetServicesProvider } from "../../../providers/get-services/get-services";
import * as uuid from "uuid";
import { Api } from "../../../providers/providers";
import { Item, StorageProvider } from "../../../providers/storage/storage";
import { AlertProvider } from "../../../providers/alert/alert";
@IonicPage()
@Component({
  selector: "page-gmpp-signup-modal",
  templateUrl: "gmpp-signup-modal.html"
})
export class GmppSignupModalPage {
  public wallets: Item[];
  submitAttempt: boolean = false;

  constructor(
    public events: Events,
    public api: Api,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public GetServicesProvider: GetServicesProvider,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController
  ) {}

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
      this.loadWallets();
    });
  }

  signup() {
    this.submitAttempt = true;
    let dat = {
      UUID: uuid.v4(),
      consumerIdentifier: this.wallets[0].walletNumber
    };
    this.alertProvider.showLoading();

    this.GetServicesProvider.load(dat, "gmpp/registerConsumer").then(data => {
      this.alertProvider.hideLoading();
      if (data.responseCode == 1) {
        this.submitAttempt = false;
        let datas = [{ tital: "Status", desc: data.responseMessage }];
        let modal = this.modalCtrl.create(
          "GmppReceiptPage",
          { data: datas },
          { cssClass: "inset-modals" }
        );
        modal.present();
        this.viewCtrl.dismiss();
      } else {
        this.submitAttempt = false;
        this.alertProvider.showAlert(data);
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
