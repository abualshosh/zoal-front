import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ModalController,
  Events
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import * as moment from "moment";
import { Item, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-gmpp-cash-out",
  templateUrl: "gmpp-cash-out.html"
})
export class GmppCashOutPage {
  private todo: FormGroup;
  public wallets: Item[];
  submitAttempt: boolean = false;

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public GetServicesProvider: GetServicesProvider,
    public alertProvider: AlertProvider,
    public storageProvider: StorageProvider,
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) {
    this.todo = this.formBuilder.group({
      cashOutAll: [, ""],
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
    this.todo.controls["cashOutAll"].setValue(false);
  }

  ionViewWillEnter() {
    this.subscribeToDataChanges();
    this.loadWallets();
  }

  loadWallets() {
    this.storageProvider.getWallets().then(wallets => {
      this.wallets = wallets;
      if (!this.wallets || this.wallets.length <= 0) {
      }
    });
  }

  subscribeToDataChanges() {
    this.events.subscribe("data:updated", () => {
      this.todo.reset();
      this.loadWallets();
    });
  }

  CASHOUT(e) {
    this.todo.controls["cashOutAll"].setValue(
      !this.todo.controls["cashOutAll"].value
    );
  }

  logForm() {
    //console.log(this.todo.controls['cashOutAll'].value)
    //console.log(this.todo.controls['transactionAmount'].value)
    if (this.todo.controls["cashOutAll"].value) {
      this.todo.controls["transactionAmount"].setValue(0);
    }
    this.submitAttempt = true;
    if (this.todo.valid) {
      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.consumerPIN = this.GetServicesProvider.encryptGmpp(
        dat.UUID + dat.consumerPIN
      );
      dat.consumerIdentifier = this.wallets[0].walletNumber;

      dat.isConsumer = "true";

      this.GetServicesProvider.doTransaction(
        this.todo.value,
        "gmpp/doCashOutWithTan"
      ).subscribe(data => {
        if (data != null && data.responseCode == 1) {
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );

          var datas = {
            destinationIdentifier: data.destinationIdentifier,
            tan: data.tan,

            fee: data.fee,
            transactionAmount: data.transactionAmount,
            totalAmount: data.totalAmount,
            transactionId: data.transactionId,
            date: datetime
          };
          var dat = [];
          var main = [];
          var mainData = {
            cashOut: data.totalAmount
          };
          dat.push({ WalletNumber: data.consumerIdentifier });
          main.push(mainData);
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
      dat.consumerPIN = null;
    }
  }
}
