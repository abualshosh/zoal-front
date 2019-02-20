import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { StorageProvider, Item } from "../../../providers/storage/storage";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
  selector: "page-qr-generator",
  templateUrl: "qr-generator.html"
})
export class QrGeneratorPage {
  public cards: Item[] = [];
  public wallets = [];
  private todo: FormGroup;
  isGmpp: boolean;
  panQr = null;
  walletQr = null;

  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public storageProvider: StorageProvider,
    private photoViewer: PhotoViewer,
    public navParams: NavParams
  ) {
    this.todo = this.formBuilder.group({
      Card: ["", Validators.required],
      wallet: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    this.checkIsGmpp();
  }

  checkIsGmpp() {
    this.isGmpp = this.navParams.get("isGmpp");
    if (this.isGmpp) {
      this.storageProvider.getWallets().then(wallets => {
        this.wallets = wallets;
        this.isCardWalletAvailable("wallet");
      });
    } else {
      this.storageProvider.getCards().then(cards => {
        this.cards = cards;
        this.isCardWalletAvailable("card");
      });
    }
  }

  isCardWalletAvailable(choice: string) {
    if (choice === "card") {
      if (!this.cards || this.cards.length <= 0) {
        this.navCtrl.pop();
        let modal = this.modalCtrl.create(
          "AddCardModalPage",
          {},
          { cssClass: "inset-modals" }
        );
        modal.present();
      }
    } else {
      if (!this.wallets || this.wallets.length <= 0) {
        this.navCtrl.pop();
        let modal = this.modalCtrl.create(
          "WalkthroughModalPage",
          {},
          { cssClass: "inset-modals" }
        );
        modal.present();
      }
    }
  }

  onChange() {
    if (!this.isGmpp) {
      this.panQr = this.todo.value.Card.cardNumber;
    } else {
      this.walletQr = this.todo.value.wallet;
    }
  }

  showQrCode(): void {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const imageData = canvas.toDataURL("image/jpeg").toString();
    this.viewImage(imageData);
  }

  viewImage(img: any) {
    this.photoViewer.show(img, "", { share: true });
  }
}
