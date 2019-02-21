import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { InAppBrowser } from "@ionic-native/in-app-browser";

@IonicPage()
@Component({
  selector: "page-about-us",
  templateUrl: "about-us.html"
})
export class AboutUsPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private iab: InAppBrowser
  ) {}

  ionViewDidLoad() {}

  openLink(link) {
    const browser = this.iab.create(link, "_system");
  }

  openContactUs() {
    let modal = this.modalCtrl.create(
      "ContactUsPage",
      {},
      {
        cssClass: "inset-modal-box"
      }
    );
    modal.present();
  }
}
