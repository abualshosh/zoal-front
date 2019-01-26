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
import { AlertController } from "ionic-angular";
import * as uuid from "uuid";
import { UserProvider } from "../../../../providers/user/user";
import { Storage } from "@ionic/storage";
import * as moment from "moment";
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from "@ionic-native/barcode-scanner";
import { TranslateService } from "@ngx-translate/core";
import { Wallet, StorageProvider } from "../../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-gmpp-tran-to-wallet",
  templateUrl: "gmpp-tran-to-wallet.html"
})
export class GmppTranToWalletPage {
  options: BarcodeScannerOptions;
  // consumerIdentifier: any;
  private todo: FormGroup;
  public wallets: Wallet[];
  submitAttempt: boolean = false;
  public GetServicesProvider: GetServicesProvider;
  qrPrompt: string;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    public alertCtrl: AlertController,
    public translateService: TranslateService,
    public user: UserProvider,
    public storage: Storage,
    public storageProvider: StorageProvider,
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) {
    // this.consumerIdentifier = "249" + localStorage.getItem("username");

    //user.printuser();
    this.GetServicesProvider = GetServicesProviderg;

    this.storageProvider.getItems().then(wallets => {
      this.wallets = wallets;
      if (!this.wallets || this.wallets.length <= 0) {
        this.noWalletAvailable();
      }
    });

    this.todo = this.formBuilder.group({
      walletNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
          Validators.pattern("[249].[0-9]*")
        ])
      ],
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

    this.translateService.get("qrCode").subscribe(value => {
      this.qrPrompt = value;
    });
  }

  noWalletAvailable() {
    this.navCtrl.pop();
    let modal = this.modalCtrl.create(
      "WalkthroughModalPage",
      {},
      { cssClass: "inset-modals" }
    );
    modal.present();
  }

  showAlert(data: any) {
    let message: any;
    if (data.responseCode != null) {
      message = data.responseMessage;
    } else {
      message = "Connection error";
    }
    let alert = this.alertCtrl.create({
      title: "ERROR",
      message: message,

      buttons: ["OK"],
      cssClass: "alertCustomCss"
    });
    alert.present();
  }

  scan() {
    this.options = {
      prompt: this.qrPrompt
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
      let loader = this.loadingCtrl.create();
      loader.present();
      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.consumerPIN = this.GetServicesProvider.encryptGmpp(
        dat.UUID + dat.consumerPIN
      );
      dat.consumerIdentifier = dat.walletNumber;
      //console.log(dat.IPIN)
      dat.isConsumer = "true";

      this.GetServicesProvider.load(this.todo.value, "gmpp/doTransfer").then(
        data => {
          //console.log(data)
          if (data != null && data.responseCode == 1) {
            loader.dismiss();
            // this.showAlert(data);
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
            loader.dismiss();
            this.showAlert(data);
            this.todo.reset();
            this.submitAttempt = false;
          }
        }
      );
    }
  }
}
