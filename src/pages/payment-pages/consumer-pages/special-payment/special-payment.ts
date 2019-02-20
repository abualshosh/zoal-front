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
import { Item, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";

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

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProvider: GetServicesProvider,
    public navCtrl: NavController,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.todo = this.formBuilder.group({
      pan: [""],
      Card: ["", Validators.required],
      MerchantId: [""],
      entityId: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
          Validators.pattern("[249][0-9]*")
        ])
      ],
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
  }

  ionViewDidLoad() {
    this.checkIsGmpp();
  }

  checkIsGmpp() {
    this.isGmpp = this.navParams.get("isGmpp");
    if (this.isGmpp) {
      this.storageProvider.getWallets().then(wallets => {
        this.wallets = wallets;
        this.showWallet = true;
        this.todo.controls["mobilewallet"].setValue(true);
        this.todo.controls["Card"].disable();
        this.isCardWalletAvailable("wallet");
      });
    } else {
      this.storageProvider.getCards().then(cards => {
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
      let loader = this.loadingCtrl.create();
      loader.present();
      dat = this.todo.value;

      dat.uUID = uuid.v4();
      dat.iPIN = this.GetServicesProvider.encrypt(dat.uUID + dat.IPIN);
      dat.IPIN = "";
      dat.amount = dat.Amount;
      dat.id = dat.MerchantId;
      if (dat.mobilewallet) {
        dat.isMobilePayment = true;
        dat.phoneNumber = dat.entityId;
        dat.pan = "";
      } else {
        dat.isMobilePayment = false;
        dat.cardNumber = dat.Card.cardNumber;
        dat.expDate = dat.Card.expDate;
      }

      this.GetServicesProvider.load(dat, "specialPayment").then(data => {
        if (data != null && data.responseCode == 0) {
          loader.dismiss();
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );

          var datas;

          datas = {
            acqTranFee: data.acqTranFee,
            issuerTranFee: data.issuerTranFee,
            tranAmount: data.tranAmount,
            serviceInfo: data.serviceInfo,
            tranCurrency: data.tranCurrency,
            date: datetime
          };

          var main = [];
          var mainData = {
            specialPaymentServices: data.tranAmount
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
          loader.dismiss();
          this.alertProvider.showAlert(data);
          this.clearInput();

          this.submitAttempt = false;
        }
      });
    }
  }
}
