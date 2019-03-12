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
import { LoadingController } from "ionic-angular";
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
  private todo: FormGroup;
  public cards: Item[] = [];
  public wallets: Item[] = [];
  public payee: any[] = [];
  public title: any;
  showWallet: boolean = false;
  submitAttempt: boolean = false;
  validCard: boolean = false;
  isGmpp: boolean;

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProvider: GetServicesProvider,
    public navCtrl: NavController,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.title = this.navParams.get("name");

    this.todo = this.formBuilder.group({
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
      METER: ["", Validators.required],
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
      dat = this.todo.value;

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

      dat.paymentInfo = "METER=" + dat.METER;
      dat.payeeId = "National Electricity Corp.";

      this.GetServicesProvider.load(dat, "consumer/payment").then(data => {
        if (data != null && data.responseCode == 0) {
          loader.dismiss();
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );
          var datas;

          let token = null;
          if (Object.keys(data.billInfo).length > 0) {
            token = data.billInfo.token;
          }
          datas = {
            acqTranFee: data.acqTranFee,
            issuerTranFee: data.issuerTranFee,
            tranAmount: data.tranAmount,
            tranCurrency: data.tranCurrency,
            date: datetime
          };

          var dat = [];
          if (data.PAN) {
            dat.push({ token: token, Card: data.PAN });
          } else {
            dat.push({ WalletNumber: data.entityId });
          }
          var main = [];
          var mainData = {
            electricityServices: data.tranAmount
          };
          main.push(mainData);

          if (Object.keys(data.billInfo).length > 0) {
            data.billInfo.opertorMessage = null;
            data.billInfo.accountNo = null;
            data.billInfo.token = null;
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
          this.clearInput();
          this.submitAttempt = false;
        }
      });
    }
  }
}
