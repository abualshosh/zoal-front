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

@IonicPage()
@Component({
  selector: "page-electricity-services",
  templateUrl: "electricity-services.html"
})
export class ElectricityServicesPage {
  profile: any;
  public cards: any[] = [];
  public wallets: Item[] = [];
  public payee: any[] = [];
  showWallet: boolean = false;
  submitAttempt: boolean = false;
  validCard: boolean = false;
  isGmpp: boolean;
  favorites: Item[];

  isReadyToSave: boolean;

  todo = this.formBuilder.group({
    pan: [""],
    Card: ["", Validators.required],
    entityId: [""],
    Payee: [""],
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
    METER: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(13),
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
    public navParams: NavParams
  ) {
    this.todo.controls["mobilewallet"].setValue(false);

    this.todo.valueChanges.subscribe(v => {
      this.isReadyToSave = this.todo.valid;
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
      this.storageProvider.getCards().subscribe(cards => {
        this.cards = cards.body;
        this.showWallet = false;
        this.todo.controls["mobilewallet"].setValue(false);
        this.todo.controls["entityId"].disable();
      });
    }

    this.storageProvider.getFavorites().subscribe(favorites => {
      this.favorites = favorites.body;
    });
  }

  showFavorites() {
    if (this.favorites) {
      this.alertProvider.showRadio(this.favorites, "favorites").then(fav => {
        this.todo.controls["METER"].setValue(fav);
        if (!this.todo.controls["METER"].valid) {
          this.alertProvider.showToast("validMETERError");
          this.todo.controls["METER"].reset();
        }
      });
    }
  }

  clearInput() {
    this.todo.controls["pan"].reset();
    this.todo.controls["Card"].reset();
    this.todo.controls["entityId"].reset();
    this.todo.controls["Payee"].reset();
    this.todo.controls["IPIN"].reset();
    this.todo.controls["METER"].reset();
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
        tranCurrency: "SDG",
        pan: form.mobilewallet ? null : form.Card.pan,
        expDate: form.mobilewallet ? null : form.Card.expDate,
        authenticationType: form.mobilewallet ? "10" : "00",
        entityType: form.mobilewallet ? "Mobile Wallet" : null,
        entityId: form.mobilewallet ? this.wallets[0].walletNumber : null,
        fromAccountType: "00",
        toAccountType: "00",
        paymentInfo: "METER=" + form.METER,
        payeeId: "National Electricity Corp."
      };

      this.serviceProvider
        .doTransaction(request, "consumer/payment")
        .subscribe(res => {
          if (res != null && res.responseCode == 0) {
            const datetime = moment(res.tranDateTime, "DDMMyyHhmmss").format(
              "DD/MM/YYYY  hh:mm:ss"
            );
            const main = [{ electricityServices: res.tranAmount }];
            let data = [];
            let token = null;

            if (Object.keys(res.billInfo).length > 0) {
              token = res.billInfo.token;
            }

            if (res.PAN) {
              data.push({ token: token, Card: res.PAN });
            } else {
              data.push({ WalletNumber: res.entityId });
            }

            if (Object.keys(res.billInfo).length > 0) {
              res.billInfo.opertorMessage = null;
              res.billInfo.accountNo = null;
              res.billInfo.token = null;
              res.billInfo.netAmount = null;
              data.push(res.billInfo);
            }

            data.push({
              fees:
                this.calculateFees(res) !== 0 ? this.calculateFees(res) : null,
              date: datetime
            });

            let modal = this.modalCtrl.create(
              "TransactionDetailPage",
              { data: data, main: main },
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
