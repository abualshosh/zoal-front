import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import { AlertProvider } from "../../../../providers/alert/alert";
import { StorageProvider, Item } from "../../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-customs-inquiry",
  templateUrl: "customs-inquiry.html"
})
export class CustomsInquiryPage {
  private todo: FormGroup;
  public cards: Item[] = [];
  public payee: any[] = [];
  public title: any;

  submitAttempt: boolean = false;

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
    this.title = this.navParams.get("name");

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
      DECLARANTCODE: ["", Validators.required]
    });
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

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      let loader = this.loadingCtrl.create();
      loader.present();
      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.IPIN = this.GetServicesProvider.encrypt(dat.UUID + dat.IPIN);

      dat.tranCurrency = "SDG";

      dat.tranAmount = dat.Amount;
      dat.toCard = dat.ToCard;
      dat.authenticationType = "00";
      dat.fromAccountType = "00";
      dat.toAccountType = "00";
      dat.paymentInfo =
        "BANKCODE=" + dat.BANKCODE + "/DECLARANTCODE=" + dat.DECLARANTCODE;
      dat.payeeId = "0010030003";
      dat.PAN = dat.Card.cardNumber;
      dat.expDate = dat.Card.expDate;

      this.GetServicesProvider.load(dat, "consumer/getBill").then(data => {
        if (data != null && data.responseCode == 0) {
          loader.dismiss();
          var main = [];
          var mainData = {
            customsInquiryPage: data.billInfo.Amount
          };
          main.push(mainData);

          var dat = [];
          dat.push({ Card: data.PAN });

          if (Object.keys(data.billInfo).length > 0) {
            dat.push(data.billInfo);
          }

          let modal = this.modalCtrl.create(
            "TransactionDetailPage",
            { data: dat, main: main },
            { cssClass: "inset-modal" }
          );
          modal.present();
          this.todo.reset();
          this.submitAttempt = false;
        } else {
          loader.dismiss();
          this.alertProvider.showAlert(data);
          this.todo.reset();
          this.submitAttempt = false;
        }
      });
    }
  }
}
