import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Events
} from "ionic-angular";
import { StorageProvider } from "../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-card-wallet-favorite-detail",
  templateUrl: "card-wallet-favorite-detail.html"
})
export class CardWalletFavoriteDetailPage {
  type: string;
  items = [];
  pageTitle: string;

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public storageProvider: StorageProvider
  ) {
    this.type = navParams.get("type");

    this.loadItems();
  }

  ionViewDidLoad() {
    if (this.type == "wallets") {
      this.pageTitle = "gmppWalletDetailPage";
    } else if (this.type == "cards") {
      this.pageTitle = "cardDetailPage";
    } else if (this.type == "favorites") {
      this.pageTitle = "favoriteDetailPage";
    }
  }

  loadItems() {
    if (this.type.match("cards")) {
      this.storageProvider.getCards().subscribe(res => {
        this.items = res.body
      })
    }
    this.storageProvider.getItemss(this.type).then(items => {
      this.items = items;      
    });
  }

  checkIfDeleteable(): boolean {
    if (this.type == "favorites") {
      return true;
    } else if (this.items.length == 1) {
      return false;
    }
    return true;
  }

  addItem() {
    let modal = this.modalCtrl.create(
      "ItemCreatePage",
      { key: this.type },
      {
        cssClass: "inset-modal-box item-create-modal"
      }
    );
    modal.present();
    modal.onDidDismiss(item => {
      this.loadItems();
    });
  }

  updateItem(item) {
    let modal = this.modalCtrl.create(
      "ItemCreatePage",
      { key: this.type, item: item },
      {
        cssClass: "inset-modal-box item-create-modal"
      }
    );
    modal.present();
    modal.onDidDismiss(item => {
      this.loadItems();
    });
  }

  deleteItem(item) {
    this.storageProvider.deleteItem(item.id, this.type).then(() => {
      this.events.publish("data:updated", "");
      this.loadItems();
    });
  }
}
