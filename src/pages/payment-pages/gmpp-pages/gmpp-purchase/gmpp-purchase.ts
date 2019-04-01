import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ModalController,
  Events
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import * as moment from "moment";
import { Item, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-gmpp-purchase",
  templateUrl: "gmpp-purchase.html"
})
export class GmppPurchasePage {
  // consumerIdentifier: any;
  private todo: FormGroup;
  public wallets: Item[];
  submitAttempt: boolean = false;
  public GetServicesProvider: GetServicesProvider;
  favorites: Item[];

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    public alertProvider: AlertProvider,
    public storageProvider: StorageProvider,
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) {
    // this.consumerIdentifier = "249" + localStorage.getItem("username");

    this.GetServicesProvider = GetServicesProviderg;

    this.todo = this.formBuilder.group({
      destinationIdentifier: [
        "",
        Validators.compose([Validators.required, Validators.pattern("[0-9]*")])
      ],
      transactionAmount: ["", Validators.required],
      consumerPIN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ]
    });
  }

  ionViewWillEnter() {
    this.subscribeToDataChanges();
    this.loadWallets();
  }

  loadWallets() {
    this.storageProvider.getWallets().then(wallets => {
      this.wallets = wallets;
    });

    this.storageProvider.getFavorites().then(favorites => {
      this.favorites = favorites;
    });
  }

  subscribeToDataChanges() {
    this.events.subscribe("data:updated", () => {
      this.todo.reset();
      this.loadWallets();
    });
  }

  showFavorites() {
    if (this.favorites) {
      this.alertProvider.showRadio(this.favorites, "favorites").then(fav => {
        this.todo.controls["destinationIdentifier"].setValue(fav);
        if (!this.todo.controls["destinationIdentifier"].valid) {
          this.alertProvider.showToast("validSellerIDError");
          this.todo.controls["destinationIdentifier"].reset();
        }
      });
    }
  }

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      let loader = this.loadingCtrl.create();
      loader.present();
      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.consumerPIN = this.GetServicesProvider.encryptGmpp(
        dat.UUID + dat.consumerPIN
      );
      dat.consumerIdentifier = this.wallets[0].walletNumber;
      dat.transactionName = dat.walletNumber;

      dat.isConsumer = "true";

      this.GetServicesProvider.load(this.todo.value, "gmpp/doPurchase").then(
        data => {
          if (data != null && data.responseCode == 1) {
            loader.dismiss();
            var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
              "DD/MM/YYYY  hh:mm:ss"
            );

            var datas = {
              destinationIdentifier: data.destinationIdentifier,
              fee: data.fee,
              "Extarnal Fee": data.externalFee,
              transactionAmount: data.transactionAmount,
              transactionId: data.transactionId,
              date: datetime
            };
            var dat = [];
            var main = [];
            var mainData = {
              purchase: data.transactionAmount
            };
            dat.push({ WalletNumber: data.consumerIdentifier });
            main.push(mainData);
            dat.push(datas);
            let modal = this.modalCtrl.create(
              "TransactionDetailPage",
              { data: dat, main: main },
              { cssClass: "inset-modal" }
            );
            modal.present();
            this.todo.reset();
            this.submitAttempt = false;
          } else {
            loader.dismiss();
            this.alertProvider.showAlert(data);
            this.todo.reset();
            this.submitAttempt = false;
          }
        }
      );
    }
  }
}
