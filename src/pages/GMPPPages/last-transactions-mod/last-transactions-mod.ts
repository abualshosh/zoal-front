import { Component } from "@angular/core";
import {
  ViewController,
  IonicPage,
  NavController,
  NavParams
} from "ionic-angular";

/**
 * Generated class for the LastTransactionsModPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-last-transactions-mod",
  templateUrl: "last-transactions-mod.html"
})
export class LastTransactionsModPage {
  public items: any[] = [];
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.items = this.navParams.get("data");
    //console.log(  this.items);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LastTransactionsModPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
