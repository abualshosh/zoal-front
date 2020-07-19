import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Events
} from "ionic-angular";
import { Validators, FormBuilder } from "@angular/forms";
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
  public cards: any[] = [];
  submitAttempt: boolean = false;

  favorites: Item[];
  title: string;

  isReadyToSave: boolean;

  todo = this.formBuilder.group({
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
    ],
    comment:[""]
  });

  constructor(
    public events: Events,
    private barcodeScanner: BarcodeScanner,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    public serviceProvider: GetServicesProvider,
    public navCtrl: NavController,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public qrScanProvider: QrScanProvider,
    public modalCtrl: ModalController
  ) {
    this.title = this.navParams.get("title")
      ? this.navParams.get("title")
      : "transferToCard";

    if (this.navParams.get("pan")) {
      this.todo.controls["ToCard"].setValue(this.navParams.get("pan"));
    }

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
    });

    this.storageProvider.getFavorites().subscribe(favorites => {
      this.favorites = favorites.body;
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
    ).catch(err => {
      this.qrScanProvider.isScanning = false;
    });
  }

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      const form = this.todo.value;
      const tranUuid = uuid.v4();
      const request = {
        UUID: tranUuid,
        IPIN: this.serviceProvider.encrypt(tranUuid + form.IPIN),
        tranCurrency: "SDG",
        tranAmount: form.Amount,
        toCard: form.ToCard,
        authenticationType: "00",
        fromAccountType: "00",
        toAccountType: "00",
        PAN: form.Card.cardNumber,
        expDate: form.Card.expDate,
        comment:form.comment
      };

      this.serviceProvider
        .doTransaction(request, "consumer/doCardTransfer")
        .subscribe(res => {
          if (res != null && res.responseCode == 0) {
            const datetime = moment(res.tranDateTime, "DDMMyyHhmmss").format(
              "DD/MM/YYYY  hh:mm:ss"
            );

            const main = [{ transferToCard: res.tranAmount }];
            const data = [
              {
                Card: res.PAN,
                toCard: res.toCard,
                fees:
                  this.calculateFees(res) !== 0
                    ? this.calculateFees(res)
                    : null,
                date: datetime
              }
            ];

            let modal = this.modalCtrl.create(
              "TransactionDetailPage",
              { data: data, main: main },
              { cssClass: "inset-modal" }
            );
            modal.present();
            this.todo.reset();
            this.submitAttempt = false;
          } else {
            this.alertProvider.showAlert(res);
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
