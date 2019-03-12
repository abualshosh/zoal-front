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
import { AlertProvider } from "../../../../providers/alert/alert";
import { StorageProvider, Item } from "../../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-customs",
  templateUrl: "customs.html"
})
export class CustomsPage {
  profile: any;
  public title: any;
  public type = "customsPayment";
  private todo: FormGroup;
  public cards: Item[] = [];
  public payee: any[] = [];
  submitAttempt: boolean = false;

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProvider: GetServicesProvider,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.title = "customsServices";

    this.todo = this.formBuilder.group({
      pan: [""],
      Card: ["", Validators.required],
      Payee: [""],
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
  }

  ionViewWillEnter() {
    this.subscribeToDataChanges();
    this.loadData();
  }

  subscribeToDataChanges() {
    this.events.subscribe("data:updated", () => {
      this.todo.reset();
      this.loadData();
    });
  }

  loadData() {
    this.storageProvider.getCards().then(val => {
      this.cards = val;
      this.isCardAvailable();
    });
  }

  checkType(_event) {
    if (this.type === "customsPayment") {
      this.todo.controls["Amount"].enable();
    } else {
      this.todo.controls["Amount"].disable();
    }
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
    this.todo.controls["Payee"].reset();
    this.todo.controls["IPIN"].reset();
    this.todo.controls["BANKCODE"].reset();
    this.todo.controls["DECLARANTCODE"].reset();
    this.todo.controls["Amount"].reset();
  }

  logForm() {
    var dat = this.todo.value;
    this.submitAttempt = true;
    if (this.todo.valid) {
      let loader = this.loadingCtrl.create();
      loader.present();
      dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.IPIN = this.GetServicesProvider.encrypt(dat.UUID + dat.IPIN);

      dat.tranCurrency = "SDG";
      dat.tranAmount = dat.Amount;

      dat.PAN = dat.Card.cardNumber;
      dat.expDate = dat.Card.expDate;

      dat.authenticationType = "00";
      dat.fromAccountType = "00";
      dat.toAccountType = "00";

      dat.paymentInfo =
        "BANKCODE=" + dat.BANKCODE + "/DECLARANTCODE=" + dat.DECLARANTCODE;

      let endpoint: string;
      if (this.type == "customsPayment") {
        endpoint = "consumer/payment";
        dat.payeeId = "Custom Service";
      } else {
        endpoint = "consumer/getBill";
        dat.payeeId = "0010030003";
      }

      this.GetServicesProvider.load(dat, endpoint).then(data => {
        if (data != null && data.responseCode == 0) {
          loader.dismiss();

          let main = [];
          let mainData = {};
          let datas = {};

          if (this.type == "customsPayment") {
            let datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
              "DD/MM/YYYY  hh:mm:ss"
            );
            datas = {
              acqTranFee: data.acqTranFee,
              issuerTranFee: data.issuerTranFee,
              tranAmount: data.tranAmount,
              tranCurrency: data.tranCurrency,
              date: datetime
            };

            mainData = {
              customsServices: data.tranAmount
            };
          } else {
            mainData = {
              customsInquiryPage: data.billInfo.Amount
            };
          }
          main.push(mainData);

          let dat = [];
          dat.push({ Card: data.PAN });

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
