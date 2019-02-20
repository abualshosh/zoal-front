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
import { AlertProvider } from "../../../../providers/alert/alert";
import { StorageProvider, Item } from "../../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-customs",
  templateUrl: "customs.html"
})
export class CustomsPage {
  showWallet: boolean = false;
  profile: any;
  public title: any;
  private todo: FormGroup;
  public cards: Item[] = [];
  public payee: any[] = [];
  submitAttempt: boolean = false;
  validCard: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProvider: GetServicesProvider,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.storageProvider.getCards().then(val => {
      this.cards = val;
      if (this.cards) {
        if (this.cards.length <= 0) {
          this.showWallet = true;
          this.todo.controls["mobilewallet"].setValue(true);
        }
      } else {
        this.showWallet = true;
        this.todo.controls["mobilewallet"].setValue(true);
      }
    });

    this.title = "customsServices";

    this.todo = this.formBuilder.group({
      pan: [""],
      Card: ["", Validators.required],
      Payee: [""],
      entityId: [
        "",
        Validators.compose([
          // Validators.required,
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
      BANKCODE: ["", Validators.required],
      DECLARANTCODE: ["", Validators.required],
      Amount: ["", Validators.required]
    });
    this.todo.controls["mobilewallet"].setValue(false);
  }

  ionViewDidEnter() {
    this.storageProvider.getCards().then(val => {
      this.cards = val;
      this.isCardAvailable();
    });
  }

  isCardAvailable() {
    if (!this.cards || this.cards.length <= 0) {
      this.navCtrl.pop();
      let modal = this.modalCtrl.create(
        "AddCardModalPage",
        {},
        { cssClass: "inset-modals" }
      );
      modal.present();
    }
  }

  clearInput() {
    this.todo.controls["pan"].reset();
    this.todo.controls["Card"].reset();
    this.todo.controls["entityId"].reset();
    this.todo.controls["Payee"].reset();
    this.todo.controls["IPIN"].reset();
    this.todo.controls["BANKCODE"].reset();
    this.todo.controls["DECLARANTCODE"].reset();
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
        "BANKCODE=" + dat.BANKCODE + "/DECLARANTCODE=" + dat.DECLARANTCODE;
      dat.payeeId = "Custom Service";

      this.GetServicesProvider.load(dat, "consumer/payment").then(data => {
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
            tranCurrency: data.tranCurrency,
            date: datetime
          };

          var main = [];
          var mainData = {
            customsServices: data.tranAmount
          };
          main.push(mainData);
          var dat = [];
          if (data.PAN) {
            dat.push({ Card: data.PAN });
          } else {
            dat.push({ WalletNumber: data.entityId });
          }

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
          this.clearInput();

          this.submitAttempt = false;
        }
      });
    }
  }
}
