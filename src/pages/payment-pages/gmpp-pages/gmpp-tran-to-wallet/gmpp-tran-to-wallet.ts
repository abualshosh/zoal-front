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
import * as moment from "moment";
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from "@ionic-native/barcode-scanner";
import { Item, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-gmpp-tran-to-wallet",
  templateUrl: "gmpp-tran-to-wallet.html"
})
export class GmppTranToWalletPage {
  options: BarcodeScannerOptions;
  // consumerIdentifier: any;
  private todo: FormGroup;
  public wallets: Item[];
  submitAttempt: boolean = false;
  public GetServicesProvider: GetServicesProvider;
  favorites: Item[];

  constructor(
    public events: Events,
    private barcodeScanner: BarcodeScanner,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    public GetServicesProviderg: GetServicesProvider,
    public alertProvider: AlertProvider,
    public storageProvider: StorageProvider,
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) {
    // this.consumerIdentifier = "249" + localStorage.getItem("username");

    this.GetServicesProvider = GetServicesProviderg;

    this.todo = this.formBuilder.group({
      destinationIdentifier: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
          Validators.pattern("[249].[0-9]*")
        ])
      ],
      transactionAmount: ["", Validators.required],
      consumerPIN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ]
    });

    if (this.navParams.get("wallet")) {
      this.todo.controls["destinationIdentifier"].setValue(
        this.navParams.get("wallet")
      );
    }
  }

  ionViewWillEnter() {
    this.subscribeToDataChanges();
    this.loadWallets();
  }

  loadWallets() {
    this.storageProvider.getWallets().then(wallets => {
      this.wallets = wallets;
    });

    this.storageProvider.getFavorites().then(favorites => {
      this.favorites = favorites;
    });
  }

  subscribeToDataChanges() {
    this.events.subscribe("data:updated", () => {
      this.todo.reset();
      this.loadWallets();
    });
  }

  showFavorites() {
    if (this.favorites) {
      this.alertProvider.showRadio(this.favorites, "favorites").then(fav => {
        this.todo.controls["destinationIdentifier"].setValue(fav);
        if (!this.todo.controls["destinationIdentifier"].valid) {
          this.alertProvider.showToast("validWalletError");
          this.todo.controls["destinationIdentifier"].reset();
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
        if (barcodeData.text) {
          // alert(barcodeData.text);
          this.todo.controls["destinationIdentifier"].setValue(
            barcodeData.text
          );
        }
      },
      err => {
        //console.log("Error occured : " + err);
      }
    );
  }

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      this.alertProvider.showLoading();

      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.consumerPIN = this.GetServicesProvider.encryptGmpp(
        dat.UUID + dat.consumerPIN
      );
      dat.consumerIdentifier = this.wallets[0].walletNumber;

      dat.isConsumer = "true";

      this.GetServicesProvider.load(this.todo.value, "gmpp/doTransfer").then(
        data => {
          if (data != null && data.responseCode == 1) {
            this.alertProvider.hideLoading();
            var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
              "DD/MM/YYYY  hh:mm:ss"
            );

            var datas = {
              destinationIdentifier: data.destinationIdentifier,
              fee: data.fee,
              transactionAmount: data.transactionAmount,
              totalAmount: data.totalAmount,
              transactionId: data.transactionId,
              date: datetime
            };
            var dat = [];
            var main = [];
            var mainData = {
              transfer: data.totalAmount
            };
            dat.push({ WalletNumber: data.consumerIdentifier });
            main.push(mainData);
            dat.push(datas);
            let modal = this.modalCtrl.create(
              "TransactionDetailPage",
              { data: dat, main: main },
              { cssClass: "inset-modal" }
            );
            // var datas =[
            //   {"tital":"Status","desc":data.responseMessage},
            //    {"tital":"Fee","desc":data.fee},
            //     {"tital":"transaction Amount","desc":data.transactionAmount},
            //     {"tital":"Total Amount","desc":data.totalAmount}

            //  ];
            //    let modal = this.modalCtrl.create('GmppReceiptPage', {"data":datas},{ cssClass: 'inset-modal' });
            modal.present();
            this.todo.reset();
            this.submitAttempt = false;
          } else {
            this.alertProvider.hideLoading();
            this.alertProvider.showAlert(data);
            this.todo.reset();
            this.submitAttempt = false;
          }
        }
      );
    }
  }
}
