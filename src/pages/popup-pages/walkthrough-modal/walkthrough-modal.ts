import { Component } from "@angular/core";
import {
  ViewController,
  IonicPage,
  ModalController,
  NavController
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-walkthrough-modal",
  templateUrl: "walkthrough-modal.html"
})
export class WalkthroughModalPage {
  constructor(
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public navCtrl: NavController
  ) {}

  addWallet() {
    this.navCtrl.push("GmppWalletDetailPage");
    this.viewCtrl.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
