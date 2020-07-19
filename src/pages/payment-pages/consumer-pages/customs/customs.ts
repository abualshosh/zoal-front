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
  public cards: any
  public payee: any[] = [];
  submitAttempt: boolean = false;
  favorites: any[];

  isReadyToSave: boolean;

  todo = this.formBuilder.group({
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
    BANKCODE: [
      "",
      Validators.compose([Validators.required, Validators.pattern("[0-9]*")])
    ],
    DECLARANTCODE: [
      "",
      Validators.compose([Validators.required, Validators.pattern("[0-9]*")])
    ],
    Amount: ["", Validators.required]
  });

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public serviceProvider: GetServicesProvider,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.title = "customsServices";

    this.todo.valueChanges.subscribe(v => {
      this.isReadyToSave = this.todo.valid;
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
    this.storageProvider.getCards().subscribe(res => {
      this.cards = res.body
    })

    this.storageProvider.getFavorites().subscribe(favorites => {
      this.favorites = favorites.body;
    });
  }

  checkType(_event) {
    if (this.type === "customsPayment") {
      this.todo.controls["Amount"].enable();
    } else {
      this.todo.controls["Amount"].disable();
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
    const form = this.todo.value;
    this.submitAttempt = true;
    if (this.todo.valid) {
      const tranUuid = uuid.v4();
      const request = {
        UUID: tranUuid,
        IPIN: this.serviceProvider.encrypt(tranUuid + form.IPIN),
        tranAmount: form.Amount,
        tranCurrency: "SDG",
        PAN: form.Card.cardNumber,
        expDate: form.Card.expDate,
        authenticationType: "00",
        fromAccountType: "00",
        toAccountType: "00",
        paymentInfo:
          "BANKCODE=" + form.BANKCODE + "/DECLARANTCODE=" + form.DECLARANTCODE,
        payeeId: "Custom Service"
      };

      let endpoint: string;
      if (this.type == "customsPayment") {
        endpoint = "consumer/payment";
      } else {
        endpoint = "consumer/getBill";
      }

      this.serviceProvider.doTransaction(request, endpoint).subscribe(res => {
        if (res != null && res.responseCode == 0) {
          let main = [];
          let data = [];
          let mainData = {};
          let datas = {};

          if (this.type == "customsPayment") {
            const datetime = moment(res.tranDateTime, "DDMMyyHhmmss").format(
              "DD/MM/YYYY  hh:mm:ss"
            );
            datas = {
              fees:
                this.calculateFees(res) !== 0
                  ? this.calculateFees(res)
                  : null,
              date: datetime
            };

            mainData = {
              customsServices: res.tranAmount
            };
          } else {
            mainData = {
              customsInquiryPage: res.billInfo.Amount
            };
          }

          main.push(mainData);
          data.push({ Card: res.PAN });

          if (Object.keys(res.billInfo).length > 0) {
            res.billInfo.Status = null;
            res.billInfo.ReceiptDate = null;
            res.billInfo.ReceiptSerial = null;
            res.billInfo.RegistrationSerial = null;
            res.billInfo.ProcStatus = null;
            res.billInfo.ProcError = null;
            data.push(res.billInfo);
          }

          data.push(datas);

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
