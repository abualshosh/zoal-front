import { Component } from "@angular/core";
import {
  NavController,
  ModalController,
  IonicPage,
  AlertController
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-popup-modal",
  templateUrl: "popup-modal.html"
})
export class PopupModalsPage {
  rootPage: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) {}

  openHintModal() {
    this.openModal("AddCardModalPage");
  }

  openWalkthroughModal() {
    this.openModal("WalkthroughModalPage");
  }

  openSignupModal() {
    this.openModal("GmppSignupModalPage");
  }

  openModal(pageName) {
    this.modalCtrl
      .create(pageName, null, { cssClass: "inset-modals" })
      .present();
  }
}
