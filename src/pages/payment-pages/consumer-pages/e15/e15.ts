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
  selector: "page-e15",
  templateUrl: "e15.html"
})
export class E15Page {
  showWallet: boolean = false;
  profile: any;
  submitAttempt: boolean = false;
  private todo: FormGroup;
  public cards: Item[] = [];
  public wallets: Item[];
  public payee: any[] = [];
  validCard: boolean = false;
  isGmpp: boolean;
  favorites: Item[];

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public GetServicesProvider: GetServicesProvider,
    public navCtrl: NavController,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public storageProvider: StorageProvider,
    public navParams: NavParams
  ) {
    this.todo = this.formBuilder.group({
      pan: [""],
      Card: ["", Validators.required],
      Payee: [""],
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
      INVOICENUMBER: [
        "",
        Validators.compose([Validators.required, Validators.pattern("[0-9]*")])
      ],
      PHONENUMBER: [
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

  clearInput() {
    this.todo.controls["pan"].reset();
    this.todo.controls["Card"].reset();
    this.todo.controls["entityId"].reset();
    this.todo.controls["Payee"].reset();
    this.todo.controls["IPIN"].reset();
    this.todo.controls["INVOICENUMBER"].reset();
    this.todo.controls["PHONENUMBER"].reset();
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

      dat.paymentInfo =
        "SERVICEID=6/INVOICENUMBER=" +
        dat.INVOICENUMBER +
        "/PHONENUMBER=" +
        dat.PHONENUMBER;
      dat.payeeId = "E15";

      this.GetServicesProvider.load(dat, "consumer/payment").then(data => {
        if (data != null && data.responseCode == 0) {
          this.alertProvider.hideLoading();
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );

          var datas;

          datas = {
            fees:
              this.calculateFees(data) !== 0 ? this.calculateFees(data) : null,
            date: datetime
          };

          var main = [];
          var mainData = {
            e15Services: data.tranAmount
          };
          main.push(mainData);
          var dat = [];
          if (data.PAN) {
            dat.push({ Card: data.PAN });
          } else {
            dat.push({ WalletNumber: data.entityId });
          }

          if (Object.keys(data.billInfo).length > 0) {
            data.billInfo.UnitName = null;
            data.billInfo.ServiceName = null;
            data.billInfo.TotalAmount = null;
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
