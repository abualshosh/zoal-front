import { Component } from "@angular/core";
import {
  NavParams,
  ViewController,
  IonicPage,
  NavController
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-add-card-modal",
  templateUrl: "add-card-modal.html"
})
export class AddCardModalPage {
  myParam: string;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    params: NavParams
  ) {
    this.myParam = params.get("myParam");
  }

  addCard() {
    this.navCtrl.push("CardDetailPage");
    this.viewCtrl.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
