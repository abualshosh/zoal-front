import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Events } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-payment-method",
  templateUrl: "payment-method.html"
})
export class PaymentMethodPage {
  profile: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events
  ) {
    this.profile = JSON.parse(localStorage.getItem("profile"));
    this.events.publish("isGmpp", "neither");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PaymentMethodPage");
  }

  openConsumerPage() {
    this.events.publish("isGmpp", "consumer");
    this.navCtrl.setRoot("ConsumerMenuPage");
  }

  openGmppPage() {
    this.events.publish("isGmpp", "gmpp");
    this.navCtrl.setRoot("GmppMenuPage");
  }
}
