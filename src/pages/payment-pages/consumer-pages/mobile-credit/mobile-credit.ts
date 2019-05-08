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

@IonicPage()
@Component({
  selector: "page-mobile-credit",
  templateUrl: "mobile-credit.html"
})
export class MobileCreditPage {
  profile: any;

  private todo: FormGroup;
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

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public GetServicesProvider: GetServicesProvider,
    public navCtrl: NavController,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.title = this.navParams.get("name");
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

    this.todo = this.formBuilder.group({
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
    this.todo.controls["mobilewallet"].setValue(false);
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

      dat.UUID = uuid.v4();
      dat.IPIN = this.GetServicesProvider.encrypt(dat.UUID + dat.IPIN);

      dat.tranCurrency = "SDG";

      dat.tranAmount = dat.Amount;

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

      dat.fromAccountType = "00";
      dat.toAccountType = "00";
      dat.paymentInfo = "MPHONE=" + dat.MPHONE;

      this.GetServicesProvider.load(dat, "consumer/payment").then(data => {
        if (data != null && data.responseCode == 0) {
          this.alertProvider.hideLoading();
          var dats = this.todo.value;
          var datas;
          var dat = [];
          if (data.PAN) {
            dat.push({ Card: data.PAN });
          } else {
            dat.push({ WalletNumber: data.entityId });
          }
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );

          datas = {
            PhoneNumber: dats.MPHONE,
            fees:
              this.calculateFees(data) !== 0 ? this.calculateFees(data) : null,
            date: datetime
          };

          var main = [];
          var mainData = {
            [this.title]: data.tranAmount
          };
          main.push(mainData);
          if (Object.keys(data.billInfo).length > 0) {
            dat.push(data.billInfo);
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
