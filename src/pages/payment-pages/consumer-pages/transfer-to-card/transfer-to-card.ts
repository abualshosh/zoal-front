import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Events
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from "@ionic-native/barcode-scanner";
import * as moment from "moment";
import { AlertProvider } from "../../../../providers/alert/alert";
import { StorageProvider, Item } from "../../../../providers/storage/storage";
import { QrScanProvider } from "../../../../providers/qr-scan/qr-scan";

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
  favorites: Item[];
  title: string;

  constructor(
    public events: Events,
    private barcodeScanner: BarcodeScanner,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    public GetServicesProviderg: GetServicesProvider,
    public navCtrl: NavController,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public qrScanProvider: QrScanProvider,
    public modalCtrl: ModalController
  ) {
    this.title = this.navParams.get("title")
      ? this.navParams.get("title")
      : "transferToCard";
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
          Validators.maxLength(19),
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
    });

    this.storageProvider.getFavorites().then(favorites => {
      this.favorites = favorites;
    });
  }

  showFavorites() {
    if (this.favorites) {
      this.alertProvider.showRadio(this.favorites, "favorites").then(fav => {
        this.todo.controls["ToCard"].setValue(fav);
        if (!this.todo.controls["ToCard"].valid) {
          this.alertProvider.showToast("validTocardError");
          this.todo.controls["ToCard"].reset();
        }
      });
    }
  }

  scan() {
    this.options = {
      prompt: ""
    };
    this.barcodeScanner.scan(this.options).then(
      barcodeData => {
        this.qrScanProvider.isScanning = false;
        if (barcodeData.cancelled) {
          this.qrScanProvider.isScanning = true;
        }
        if (barcodeData.text) {
          this.todo.controls["ToCard"].setValue(barcodeData.text);
        }
      },
      err => {
        this.qrScanProvider.isScanning = false;
      }
    );
  }

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
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

      this.GetServicesProvider.doTransaction(
        this.todo.value,
        "consumer/doCardTransfer"
      ).subscribe(data => {
        if (data != null && data.responseCode == 0) {
          var datas;
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );
          datas = {
            Card: data.PAN,
            toCard: data.toCard,
            fees:
              this.calculateFees(data) !== 0 ? this.calculateFees(data) : null,
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
          this.alertProvider.showAlert(data);
          this.todo.reset();
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
