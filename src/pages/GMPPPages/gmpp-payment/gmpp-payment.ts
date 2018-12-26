import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";

import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../providers/get-services/get-services";
import { AlertController } from "ionic-angular";
import * as NodeRSA from "node-rsa";
import * as uuid from "uuid";
import { UserProvider } from "../../../providers/user/user";
import { Storage } from "@ionic/storage";
import { Card } from "../../../models/cards";
/**
 * Generated class for the GmppPaymentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-gmpp-payment",
  templateUrl: "gmpp-payment.html"
})
export class GmppPaymentPage {
  consumerIdentifier: any;
  private bal: any;
  private todo: FormGroup;
  public cards: Card[] = [];
  submitAttempt: boolean = false;
  public GetServicesProvider: GetServicesProvider;
  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    public alertCtrl: AlertController,
    public user: UserProvider,
    public storage: Storage,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.storage.get("username").then(val => {
      this.consumerIdentifier = val;
    });

    //user.printuser();
    this.GetServicesProvider = GetServicesProviderg;
    this.todo = this.formBuilder.group({
      customerPayeeId: ["", Validators.required],
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

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.serviceName = this.navParams.get("serviceName");
      dat.transactionName = "test";
      dat.payeeId = this.navParams.get("title");
      dat.consumerPIN = this.GetServicesProvider.encrypt(
        dat.UUID + dat.consumerPIN
      );
      dat.consumerIdentifier = this.consumerIdentifier;
      //console.log(dat.IPIN)
      dat.isConsumer = "true";

      this.GetServicesProvider.loadGmpp(this.todo.value, "Payment").then(
        data => {
          this.bal = data;
          //console.log(data)
          if (data != null && data.responseCode == 1) {
            loader.dismiss();
            // this.showAlert(data);

            var datas = [
              { tital: "Status", desc: data.responseMessage },
              { tital: "Fee", desc: data.fee },
              { tital: "External Fee", desc: data.externalFee },
              { tital: "transaction Amount", desc: data.transactionAmount },
              { tital: "Total Amount", desc: data.totalAmount }
            ];
            let modal = this.modalCtrl.create(
              "ReModelPage",
              { data: datas },
              { cssClass: "inset-modal" }
            );
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
