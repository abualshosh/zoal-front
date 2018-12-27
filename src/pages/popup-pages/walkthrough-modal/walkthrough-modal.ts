import { Component } from "@angular/core";
import { ViewController, IonicPage, ModalController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-walkthrough-modal",
  templateUrl: "walkthrough-modal.html"
})
export class WalkthroughModalPage {
  constructor(
    public modalCtrl: ModalController,
    public viewCtrl: ViewController
  ) {}

  gmpp() {
    let modal = this.modalCtrl.create(
      "GmppSignupModalPage",
      {},
      { cssClass: "inset-modals" }
    );
    modal.present();
    this.viewCtrl.dismiss();
  }

  consumer() {
    let modal = this.modalCtrl.create(
      "AddCardModalPage",
      {},
      { cssClass: "inset-modals" }
    );
    modal.present();
    this.viewCtrl.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
