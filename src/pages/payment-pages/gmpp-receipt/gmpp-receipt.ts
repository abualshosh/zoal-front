import { Component } from "@angular/core";
import { IonicPage, ViewController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-gmpp-receipt",
  templateUrl: "gmpp-receipt.html"
})
export class GmppReceiptPage {
  public items: any[] = [];
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.items = this.navParams.get("data");

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].desc == null || this.items[i].desc == "") {
        this.items.splice(i, 1);
      }
    }
  }

  ionViewDidLoad() {}

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
