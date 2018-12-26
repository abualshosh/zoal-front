import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

/**
 * Generated class for the GmppBankCardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-gmpp-bank-card",
  templateUrl: "gmpp-bank-card.html"
})
export class GmppBankCardPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    //console.log('ionViewDidLoad GmppBankCardPage');
  }
  openPage(page) {
    this.navCtrl.push(page);
  }
}
