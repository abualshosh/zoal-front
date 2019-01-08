import { Component } from "@angular/core";
import {
  ViewController,
  IonicPage,
  NavController,
  NavParams
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-last-transactions-model",
  templateUrl: "last-transactions-model.html"
})
export class LastTransactionsModelPage {
  public items: any[] = [];
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.items = this.navParams.get("data");
    //console.log(  this.items);
  }

  ionViewDidLoad() {}

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
