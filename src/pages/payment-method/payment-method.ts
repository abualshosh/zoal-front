import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { Events } from "ionic-angular";
import { Item, StorageProvider } from "../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-payment-method",
  templateUrl: "payment-method.html"
})
export class PaymentMethodPage {
  profile: any;
  cards: Item[];
  wallets: Item[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public modalCtrl: ModalController,
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

  ionViewWillEnter() {
    this.events.publish("isGmpp", "neither");
    this.loadCardsWallets();
  }

  loadCardsWallets() {
    this.storageProvider.getCards().then(cards => {
      this.cards = cards;
    });
    this.storageProvider.getWallets().then(wallets => {
      this.wallets = wallets;
    });
  }

  openConsumerPage() {
    const animationsOptions = {
      animation: "ios-transition",
      duration: 1000
    };

    this.events.publish("isGmpp", "consumer");

    if (this.isCardWalletAvailable("card")) {
      this.navCtrl.push("MainMenuPage", {}, animationsOptions);
    } else {
      this.addCardWallet("cards");
    }
  }

  openGmppPage() {
    const animationsOptions = {
      animation: "ios-transition",
      duration: 1000
    };

    this.events.publish("isGmpp", "gmpp");

    if (this.isCardWalletAvailable("wallet")) {
      this.navCtrl.push("MainMenuPage", { isGmpp: true }, animationsOptions);
    } else {
      this.addCardWallet("wallets");
    }
  }

  isCardWalletAvailable(choice: string): boolean {
    if (choice === "card") {
      if (!this.cards || this.cards.length <= 0) {
        return false;
      }
      return true;
    } else {
      if (!this.wallets || this.wallets.length <= 0) {
        return false;
      }
      return true;
    }
  }

  addCardWallet(type) {
    let modal = this.modalCtrl.create(
      "ItemCreatePage",
      { key: type },
      {
        cssClass: "inset-modal-box"
      }
    );
    modal.present();
    modal.onDidDismiss(() => {
      this.loadCardsWallets();
    });
  }
}
