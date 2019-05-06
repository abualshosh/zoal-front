import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Events
} from "ionic-angular";
import * as moment from "moment";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import { Item, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";
import { Api } from "../../../../providers/api/api";

@IonicPage()
@Component({
  selector: "page-special-payment",
  templateUrl: "special-payment.html"
})
export class SpecialPaymentPage {
  showWallet: boolean = false;
  profile: any;
  submitAttempt: boolean = false;
  private todo: FormGroup;
  public cards: Item[] = [];
  public wallets: Item[] = [];
  public payee: any[] = [];
  validCard: boolean = false;
  isGmpp: boolean;
  favorites: Item[];
  merchants: any;
  title: string;

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public servicesProvider: GetServicesProvider,
    public navCtrl: NavController,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public api: Api,
    public navParams: NavParams
  ) {
    this.title = this.navParams.get("title")
      ? this.navParams.get("title")
      : "specialPaymentServices";
    this.todo = this.formBuilder.group({
      pan: [""],
      Card: ["", Validators.required],
      MerchantId: ["", Validators.required],
      entityId: [""],
      mobilewallet: [""],
      IPIN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ],
      Amount: ["", Validators.required]
    });
    this.todo.controls["mobilewallet"].setValue(false);
    this.api.get("merchants").subscribe(res => {
      this.merchants = res;
    });
  }

  ionViewWillEnter() {
    this.subscribeToDataChanges();
    this.checkIsGmpp();
  }

  subscribeToDataChanges() {
    this.events.subscribe("data:updated", () => {
      this.clearInput();
      this.checkIsGmpp();
    });
  }

  checkIsGmpp() {
    this.isGmpp = this.navParams.get("isGmpp");
    if (this.isGmpp) {
      this.storageProvider.getWallets().then(wallets => {
        this.wallets = wallets;
        this.showWallet = true;
        this.todo.controls["mobilewallet"].setValue(true);
        this.todo.controls["Card"].disable();
      });
    } else {
      this.storageProvider.getCards().then(cards => {
        this.cards = cards;
        this.showWallet = false;
        this.todo.controls["mobilewallet"].setValue(false);
        this.todo.controls["entityId"].disable();
      });
    }

    this.storageProvider.getFavorites().then(favorites => {
      this.favorites = favorites;
    });
  }

  showFavorites() {
    if (this.favorites) {
      this.alertProvider.showRadio(this.favorites, "favorites").then(fav => {
        this.todo.controls["MerchantId"].setValue(fav);
        if (!this.todo.controls["MerchantId"].valid) {
          this.alertProvider.showToast("validMerchantIdError");
          this.todo.controls["MerchantId"].reset();
        }
      });
    }
  }

  clearInput() {
    this.todo.controls["pan"].reset();
    this.todo.controls["Card"].reset();
    this.todo.controls["entityId"].reset();
    this.todo.controls["MerchantId"].reset();
    this.todo.controls["IPIN"].reset();
    this.todo.controls["Amount"].reset();
    if (this.cards) {
      if (this.cards.length <= 0) {
        this.showWallet = true;
        this.todo.controls["mobilewallet"].setValue(true);
      }
    } else {
      this.showWallet = true;
      this.todo.controls["mobilewallet"].setValue(true);
    }
  }

  onSelectChange(selectedValue: any) {
    var dat = this.todo.value;
    if (dat.Card && !dat.mobilewallet) {
      this.validCard = true;
    }
  }

  logForm() {
    var dat = this.todo.value;
    if (dat.Card && !dat.mobilewallet) {
      this.validCard = true;
    }
    this.submitAttempt = true;
    if (this.todo.valid) {
      if (!dat.mobilewallet && !this.validCard) {
        return;
      }
      this.alertProvider.showLoading();

      dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.IPIN = this.servicesProvider.encrypt(dat.UUID + dat.IPIN);
      dat.tranAmount = dat.Amount;
      dat.serviceProviderId = dat.MerchantId.serviceProviderId;
      dat.serviceInfo = dat.MerchantId.merchantName;
      dat.dynamicFees = dat.MerchantId.dynamicFees;
      if (dat.mobilewallet) {
        dat.entityType = "Mobile Wallet";
        dat.entityId = this.wallets[0].walletNumber;
        dat.authenticationType = "10";
        dat.pan = "";
      } else {
        dat.pan = dat.Card.cardNumber;
        dat.expDate = dat.Card.expDate;
        dat.authenticationType = "00";
        dat.entityId = "";
      }

      this.servicesProvider.load(dat, "consumer/specialPayment").then(data => {
        if (data != null && data.responseStatus === "Successful") {
          this.alertProvider.hideLoading();
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );

          var datas;

          datas = {
            serviceInfo: data.serviceInfo,
            fees: data.acqTranFee + data.issuerTranFee + data.dynamicFees,
            date: datetime
          };

          var main = [];
          var mainData = {
            "": data.tranAmount
          };
          main.push(mainData);
          var dat = [];
          if (data.PAN) {
            dat.push({ Card: data.PAN });
          } else {
            dat.push({ WalletNumber: data.entityId });
          }

          dat.push(datas);
          let modal = this.modalCtrl.create(
            "TransactionDetailPage",
            { data: dat, main: main },
            { cssClass: "inset-modal" }
          );
          modal.present();
          this.clearInput();
          this.submitAttempt = false;
        } else {
          this.alertProvider.hideLoading();
          this.alertProvider.showAlert(data);
          this.clearInput();

          this.submitAttempt = false;
        }
      });
    }
  }
}
