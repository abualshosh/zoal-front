import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Events
} from "ionic-angular";
import * as moment from "moment";
import { Validators, FormBuilder } from "@angular/forms";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import { Item, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";
import { Api } from "../../../../providers/api/api";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: "page-special-payment",
  templateUrl: "special-payment.html"
})
export class SpecialPaymentPage {
  showWallet: boolean = false;
  profile: any;
  submitAttempt: boolean = false;
  public cards: Item[] = [];
  public wallets: Item[] = [];
  public payee: any[] = [];
  validCard: boolean = false;
  isGmpp: boolean;
  favorites: Item[];
  charities: any;
  title: string;
  merchant: any;
  lang: string;
  isReadyToSave: boolean;

  todo = this.formBuilder.group({
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

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public serviceProvider: GetServicesProvider,
    public navCtrl: NavController,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public api: Api,
    public navParams: NavParams,
    private translate:TranslateService
  ) {
    this.lang = this.translate.currentLang;
    this.loadPaymentType();
    this.todo.controls["mobilewallet"].setValue(false);

    this.todo.valueChanges.subscribe(v => {
      this.isReadyToSave = this.todo.valid;
    });
    
  }

  loadPaymentType() {
    if (this.navParams.get("title")) {
      this.title = this.navParams.get("title");
      this.loadCharities();
    } else if (this.navParams.get("param")) {
      this.merchant = this.navParams.get("param");
      this.todo.controls["MerchantId"].setValue(this.merchant);
      this.title = this.merchant.merchantName;
    } else {
      this.title = "specialPaymentServices";
    }
  }

  loadCharities() {
    this.api.get("merchants").subscribe((res: any) => {
      this.charities = res.filter(merchant => {
        return merchant.status == "charity";
      });
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
    const form = this.todo.value;
    if (form.Card && !form.mobilewallet) {
      this.validCard = true;
    }
    this.submitAttempt = true;
    if (this.todo.valid) {
      if (!form.mobilewallet && !this.validCard) {
        return;
      }

      const tranUuid = uuid.v4();
      const request = {
        UUID: tranUuid,
        IPIN: this.serviceProvider.encrypt(tranUuid + form.IPIN),
        tranAmount: form.Amount,
        serviceProviderId: form.MerchantId.serviceProviderId,
        serviceInfo: form.MerchantId.merchantName,
        dynamicFees: form.MerchantId.dynamicFees,
        tranCurrency: "SDG",
        pan: form.mobilewallet ? null : form.Card.cardNumber,
        expDate: form.mobilewallet ? null : form.Card.expDate,
        authenticationType: form.mobilewallet ? "10" : "00",
        entityType: form.mobilewallet ? "Mobile Wallet" : null,
        entityId: form.mobilewallet ? this.wallets[0].walletNumber : null
      };

      this.serviceProvider
        .doTransaction(request, "consumer/specialPayment")
        .subscribe(res => {
          if (res != null && res.responseStatus === "Successful") {
            const datetime = moment(res.tranDateTime, "DDMMyyHhmmss").format(
              "DD/MM/YYYY  hh:mm:ss"
            );
            const main = [{ "": res.tranAmount }];
            let dat = [];

            if (res.PAN) {
              dat.push({ Card: res.PAN });
            } else {
              dat.push({ WalletNumber: res.entityId });
            }

            dat.push({
              serviceInfo: res.serviceInfo,
              fees:
                this.calculateFees(res) !== 0 ? this.calculateFees(res) : null,
              date: datetime
            });

            let modal = this.modalCtrl.create(
              "TransactionDetailPage",
              { data: dat, main: main },
              { cssClass: "inset-modal" }
            );
            modal.present();
            this.clearInput();
            this.submitAttempt = false;
          } else {
            this.alertProvider.showAlert(res);
            this.clearInput();

            this.submitAttempt = false;
          }
        });
    }
  }

  calculateFees(response) {
    let fees = 0;
    if (response.acqTranFee) {
      fees += response.acqTranFee;
    }

    if (response.issuerTranFee) {
      fees += response.issuerTranFee;
    }

    if (response.dynamicFees) {
      fees += response.dynamicFees;
    }

    return fees;
  }
}
