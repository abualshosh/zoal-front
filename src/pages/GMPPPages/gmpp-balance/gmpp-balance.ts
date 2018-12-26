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
import * as moment from "moment";

/**
 * Generated class for the GmppBalancePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-gmpp-balance",
  templateUrl: "gmpp-balance.html"
})
export class GmppBalancePage {
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
    public modalCtrl: ModalController
  ) {
    this.consumerIdentifier = "249" + localStorage.getItem("username");

    //user.printuser();
    this.GetServicesProvider = GetServicesProviderg;
    this.todo = this.formBuilder.group({
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
      dat.consumerPIN = this.GetServicesProvider.encryptGmpp(
        dat.UUID + dat.consumerPIN
      );
      dat.consumerIdentifier = this.consumerIdentifier;
      //console.log(dat.IPIN)
      dat.isConsumer = "true";

      this.GetServicesProvider.load(this.todo.value, "gmpp/getSVABalance").then(
        data => {
          this.bal = data;
          //console.log(data)
          if (data != null && data.responseCode == 1) {
            loader.dismiss();
            // this.showAlert(data);
            //  data.availableBalance=0;
            var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
              "DD/MM/YYYY  hh:mm:ss"
            );

            var main = [];
            var mainData = {
              "available Balance": data.availableBalance
            };
            main.push(mainData);
            var datas;
            var dat = [];

            datas = {
              WalletNumber: data.consumerIdentifier,
              "available Balance": data.availableBalance,
              "reserved Balance": data.reservedBalance,
              transactionId: data.transactionId,
              date: datetime
            };
            dat.push(datas);
            let modal = this.modalCtrl.create(
              "BranchesPage",
              { data: dat, main: main },
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
