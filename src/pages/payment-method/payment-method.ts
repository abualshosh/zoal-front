import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-payment-method",
  templateUrl: "payment-method.html"
})
export class PaymentMethodPage {
  profile: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.profile = JSON.parse(localStorage.getItem("profile"));
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PaymentMethodPage");
  }

  openConsumerPage() {
    this.navCtrl.setRoot("ConsumerMenuPage");
  }

  openGmppPage() {
    this.navCtrl.setRoot("MainMenuPage");
  }
}
