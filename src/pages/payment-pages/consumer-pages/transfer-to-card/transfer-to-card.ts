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
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from "@ionic-native/barcode-scanner";
import * as moment from "moment";
import { AlertProvider } from "../../../../providers/alert/alert";
import { StorageProvider, Item } from "../../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-transfer-to-card",
  templateUrl: "transfer-to-card.html"
})
export class TransferToCardPage {
  options: BarcodeScannerOptions;
  private todo: FormGroup;
  public cards: Item[] = [];
  submitAttempt: boolean = false;

  public GetServicesProvider: GetServicesProvider;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    public navCtrl: NavController,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController
  ) {
    this.GetServicesProvider = GetServicesProviderg;
    this.todo = this.formBuilder.group({
      Card: ["", Validators.required],
      IPIN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ],
      ToCard: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(16),
          Validators.pattern("[0-9]*")
        ])
      ],
      Amount: [
        "",
        Validators.compose([Validators.required, Validators.pattern("[0-9]*")])
      ]
    });
    if (this.navParams.get("pan")) {
      this.todo.controls["ToCard"].setValue(this.navParams.get("pan"));
    }
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

  scan() {
    this.options = {
      prompt: ""
    };
    this.barcodeScanner.scan(this.options).then(
      barcodeData => {
        if (barcodeData.text) {
          this.todo.controls["ToCard"].setValue(barcodeData.text);
        }
      },
      err => {}
    );
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
      dat.PAN = dat.Card.cardNumber;
      dat.expDate = dat.Card.expDate;

      this.GetServicesProvider.load(
        this.todo.value,
        "consumer/doCardTransfer"
      ).then(data => {
        if (data != null && data.responseCode == 0) {
          loader.dismiss();
          var datas;
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );
          datas = {
            Card: data.PAN,
            toCard: data.toCard,
            acqTranFee: data.acqTranFee,
            issuerTranFee: data.issuerTranFee,
            tranAmount: data.tranAmount,
            date: datetime
          };

          var main = [];
          var mainData = {
            transferToCard: data.tranAmount
          };
          main.push(mainData);

          var dat = [];
          dat.push(datas);
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
