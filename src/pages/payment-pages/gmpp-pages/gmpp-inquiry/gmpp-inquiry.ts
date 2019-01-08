import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-gmpp-inquiry",
  templateUrl: "gmpp-inquiry.html"
})
export class GmppInquiryPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {}
  openPage(page) {
    this.navCtrl.push(page);
  }
}
