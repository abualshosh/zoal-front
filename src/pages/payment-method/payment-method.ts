import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Events } from "ionic-angular";
import { StorageProvider } from "../../providers/storage/storage";

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
    public events: Events,
    public storageProvider: StorageProvider
  ) {
    this.storageProvider.getProfile().subscribe(val => {
      this.profile = val;
    });

    events.subscribe("profile:updated", () => {
      this.storageProvider.getProfile().subscribe(val => {
        this.profile = val;
      });
    });
  }

  ionViewDidEnter() {
    this.events.publish("isGmpp", "neither");
  }

  openConsumerPage() {
    const animationsOptions = {
      animation: "ios-transition",
      duration: 1000
    };

    this.events.publish("isGmpp", "consumer");
    this.navCtrl.push("MainMenuPage", {}, animationsOptions);
  }

  openGmppPage() {
    const animationsOptions = {
      animation: "ios-transition",
      duration: 1000
    };

    this.events.publish("isGmpp", "gmpp");
    this.navCtrl.push("MainMenuPage", { isGmpp: true }, animationsOptions);
  }
}
