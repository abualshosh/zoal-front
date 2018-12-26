import { Component } from "@angular/core";
import {
  NavParams,
  ViewController,
  IonicPage,
  NavController
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-hint-modal",
  templateUrl: "hint-modal.html"
})
export class HintModalPage {
  myParam: string;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    params: NavParams
  ) {
    this.myParam = params.get("myParam");
  }
  addCard() {
    this.navCtrl.push("HomePage");
    this.viewCtrl.dismiss();
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
