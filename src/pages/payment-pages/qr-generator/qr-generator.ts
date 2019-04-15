import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Events
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { StorageProvider, Item } from "../../../providers/storage/storage";
import { SocialSharing } from "@ionic-native/social-sharing";

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
    public events: Events,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public storageProvider: StorageProvider,
    private socialSharing: SocialSharing,
    public navParams: NavParams
  ) {
    this.todo = this.formBuilder.group({
      Card: ["", Validators.required]
    });
  }

  ionViewWillEnter() {
    this.subscribeToDataChanges();
    this.checkIsGmpp();
  }

  subscribeToDataChanges() {
    this.events.subscribe("data:updated", () => {
      this.checkIsGmpp();
    });
  }

  checkIsGmpp() {
    this.isGmpp = this.navParams.get("isGmpp");
    if (this.isGmpp) {
      this.storageProvider.getWallets().then(wallets => {
        this.wallets = wallets;
        this.walletQr = this.wallets[0].walletNumber;
      });
    } else {
      this.storageProvider.getCards().then(cards => {
        this.cards = cards;
        this.todo.controls["Card"].setValue(cards[0]);
        this.panQr = cards[0].cardNumber;
      });
    }
  }

  onChange() {
    if (!this.isGmpp) {
      this.panQr = this.todo.value.Card.cardNumber;
    }
  }

  share() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const imageData = canvas.toDataURL("image/jpeg").toString();
    this.socialSharing.share(null, null, imageData).then(
      () => {},
      () => {
        alert("SocialSharing failed");
      }
    );
  }
}
