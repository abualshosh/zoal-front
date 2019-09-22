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
  selector: "page-mobile-credit",
  templateUrl: "mobile-credit.html"
})
export class MobileCreditPage {
  profile: any;

  public type = "mobileBillPayment";
  public cards: Item[] = [];
  public wallets: Item[] = [];
  public title: any;
  showWallet: boolean = false;
  validCard: boolean = false;
  public payee: any[] = [
    {
      PayeeName: "Zain Top Up",
      PayeeId: "Zain Top Up"
    },
    {
      PayeeName: "MTN Top Up",
      PayeeId: "MTN Top Up"
    },
    {
      PayeeName: "Sudani Top Up",
      PayeeId: "Sudani Top Up"
    }
  ];
  submitAttempt: boolean = false;
  isGmpp: boolean;
  favorites: Item[];

  isReadyToSave: boolean;

  todo = this.formBuilder.group({
    pan: [""],
    mobilewallet: [""],
    Card: ["", Validators.required],
    entityId: [""],
    payeeId: ["", Validators.required],
    IPIN: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern("[0-9]*")
      ])
    ],
    MPHONE: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("0[0-9]*")
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
    this.title = this.navParams.get("param");
    if (this.title === "mobileBillPayment") {
      this.payee = [
        {
          PayeeName: "Zain Bill Payment",
          PayeeId: "Zain Bill Payment"
        },
        {
          PayeeName: "MTN Bill Payment",
          PayeeId: "MTN Bill Payment"
        },
        {
          PayeeName: "SUDANI Bill Payment",
          PayeeId: "SUDANI Bill Payment"
        }
      ];
    }

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
        this.todo.controls["MPHONE"].setValue(fav);
        if (!this.todo.controls["MPHONE"].valid) {
          this.alertProvider.showToast("validvoucherNumberError");
          this.todo.controls["MPHONE"].reset();
        }
      });
    }
  }

  clearInput() {
    this.todo.controls["pan"].reset();
    this.todo.controls["Card"].reset();
    this.todo.controls["entityId"].reset();
    this.todo.controls["payeeId"].reset();
    this.todo.controls["IPIN"].reset();
    this.todo.controls["MPHONE"].reset();
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

  checkType(_event) {
    if (this.type === "mobileBillPayment") {
      this.todo.controls["Amount"].enable();
    } else if (this.title === "mobileCredit") {
      this.todo.controls["Amount"].enable();
    } else {
      this.todo.controls["Amount"].disable();
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
        PAN: form.mobilewallet ? null : form.Card.cardNumber,
        expDate: form.mobilewallet ? null : form.Card.expDate,
        authenticationType: form.mobilewallet ? "10" : "00",
        entityType: form.mobilewallet ? "Mobile Wallet" : null,
        entityId: form.mobilewallet ? this.wallets[0].walletNumber : null,
        fromAccountType: "00",
        toAccountType: "00",
        paymentInfo: "MPHONE=" + form.MPHONE,
        payeeId: form.payeeId
      };

      let endpoint: string;
      if (this.type == "mobileBillPayment") {
        endpoint = "consumer/payment";
      } else if (this.title === "mobileCredit") {
        endpoint = "consumer/payment";
      } else {
        endpoint = "consumer/getBill";
      }

      this.serviceProvider
        .doTransaction(request, endpoint)
        .subscribe(res => {
          if (res != null && res.responseCode == 0) {
            const datetime = moment(res.tranDateTime, "DDMMyyHhmmss").format(
              "DD/MM/YYYY  hh:mm:ss"
            );

            const main = [{ [this.title]: res.tranAmount }];
            let data = [];

            if (res.PAN) {
              data.push({ Card: res.PAN });
            } else {
              data.push({ WalletNumber: res.entityId });
            }

            if (Object.keys(res.billInfo).length > 0) {
              data.push(res.billInfo);
            }

            data.push({
              PhoneNumber: form.MPHONE,
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

            this.submitAttempt = false;
            this.clearInput();
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
