import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
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
    private iab: InAppBrowser
  ) {}

  ionViewDidLoad() {}

  openLink(link) {
    const browser = this.iab.create(link, "_system");
  }
}
