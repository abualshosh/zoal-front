import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import * as moment from "moment";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";

import * as uuid from "uuid";

import { Storage } from "@ionic/storage";
import { Card } from "../../../../models/cards";
import { Wallet, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-mobile-credit",
  templateUrl: "mobile-credit.html"
})
export class MobileCreditPage {
  profile: any;

  private todo: FormGroup;
  public cards: Card[] = [];
  public wallets: Wallet[] = [];
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

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProvider: GetServicesProvider,

    public navCtrl: NavController,
    public storageProvider: StorageProvider,
    public storage: Storage,
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
      entityId: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
          Validators.pattern("[249][0-9]*")
        ])
      ],
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
          Validators.pattern("[0-9]*")
        ])
      ],
      Amount: ["", Validators.required]
    });
    this.todo.controls["mobilewallet"].setValue(false);
  }

  ionViewDidLoad() {
    this.checkIsGmpp();
  }

  checkIsGmpp() {
    this.isGmpp = this.navParams.get("isGmpp");
    if (this.isGmpp) {
      this.storageProvider.getItems().then(wallets => {
        this.wallets = wallets;
        this.showWallet = true;
        this.todo.controls["mobilewallet"].setValue(true);
        this.todo.controls["Card"].disable();
        this.isCardWalletAvailable("wallet");
      });
    } else {
      this.storage.get("cards").then(cards => {
        this.cards = cards;
        this.showWallet = false;
        this.todo.controls["mobilewallet"].setValue(false);
        this.todo.controls["entityId"].disable();
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
      let loader = this.loadingCtrl.create();
      loader.present();

      dat.UUID = uuid.v4();
      dat.IPIN = this.GetServicesProvider.encrypt(dat.UUID + dat.IPIN);

      dat.tranCurrency = "SDG";

      dat.tranAmount = dat.Amount;

      if (dat.mobilewallet) {
        dat.entityType = "Mobile Wallet";

        dat.authenticationType = "10";
        dat.pan = "";
      } else {
        dat.pan = dat.Card.pan;
        dat.expDate = dat.Card.expDate;
        dat.authenticationType = "00";
        dat.entityId = "";
      }

      dat.fromAccountType = "00";
      dat.toAccountType = "00";
      dat.paymentInfo = "MPHONE=" + dat.MPHONE;

      this.GetServicesProvider.load(dat, "consumer/payment").then(data => {
        if (data != null && data.responseCode == 0) {
          loader.dismiss();
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
            acqTranFee: data.acqTranFee,
            issuerTranFee: data.issuerTranFee,
            tranAmount: data.tranAmount,
            tranCurrency: data.tranCurrency,
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
          loader.dismiss();
          this.alertProvider.showAlert(data);

          this.submitAttempt = false;
          this.clearInput();
        }
      });
    }
  }
}
