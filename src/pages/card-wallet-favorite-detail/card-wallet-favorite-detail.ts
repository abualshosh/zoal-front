import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { StorageProvider } from "../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-card-wallet-favorite-detail",
  templateUrl: "card-wallet-favorite-detail.html"
})
export class CardWalletFavoriteDetailPage {
  type: string;
  items: any;
  pageTitle: string;

  constructor(
    public navCtrl: NavController,
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
    this.storageProvider.getItemss(this.type).then(items => {
      this.items = items;
    });
  }

  addItem() {
    let modal = this.modalCtrl.create(
      "ItemCreatePage",
      { key: this.type },
      {
        cssClass: "inset-modal-box"
      }
    );
    modal.present();
    modal.onDidDismiss(item => {
      if (item) {
        this.storageProvider.addItem(item, this.type).then(item => {
          this.loadItems();
        });
      }
    });
  }

  updateItem(item) {
    let modal = this.modalCtrl.create(
      "ItemCreatePage",
      { key: this.type, item: item },
      {
        cssClass: "inset-modal-box"
      }
    );
    modal.present();
    modal.onDidDismiss(item => {
      if (item) {
        this.storageProvider.updateItem(item, this.type).then(item => {
          this.loadItems();
        });
      }
    });
  }

  deleteItem(item) {
    this.storageProvider.deleteItem(item.id, this.type).then(() => {
      this.loadItems();
    });
  }
}
