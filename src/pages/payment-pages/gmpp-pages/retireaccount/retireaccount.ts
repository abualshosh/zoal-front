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
import * as NodeRSA from "node-rsa";
import * as uuid from "uuid";
import { UserProvider } from "../../../../providers/user/user";
import { Storage } from "@ionic/storage";
import { Card } from "../../../../models/cards";
/**
 * Generated class for the GmppBalancePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-retireaccount",
  templateUrl: "retireaccount.html"
})
export class RetireaccountPage {
  consumerIdentifier: any;
  private bal: any;
  private todo: FormGroup;
  private complate: FormGroup;
  public cards: Card[] = [];
  public compleate: any = "FALSE";
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
    this.storage.get("username").then(val => {
      this.consumerIdentifier = val;
    });
    this.storage.get("RUUID").then(val => {
      this.storage.set("RetireACCOUNT", "TRUE");
      this.storage.set("RUUID", "2711dbcd-0314-431b-8731-97266974f28d");
    });
    this.storage.get("RetireACCOUNT").then(val => {
      if (val != null) {
        this.compleate = val;
      }
    });
    //user.printuser();
    //  this.compleate='TRUE';
    //console.log(this.compleate);
    this.GetServicesProvider = GetServicesProviderg;
    this.todo = this.formBuilder.group({
      retireReason: ["", Validators.required],
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

    this.complate = this.formBuilder.group({
      consumerOTP: ["", Validators.required],
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

  Cancle() {
    this.storage.set("RetireACCOUNT", "FALSE");
    this.storage.set("RUUID", null);
    this.compleate = "FALSE";
  }

  logForm() {
    if (this.todo.valid) {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.consumerPIN = this.GetServicesProvider.encrypt(
        dat.UUID + dat.consumerPIN
      );
      dat.consumerIdentifier = this.consumerIdentifier;

      //console.log(dat.IPIN)
      dat.isConsumer = "true";

      this.GetServicesProvider.loadGmpp(this.todo.value, "Retirewallet").then(
        data => {
          this.bal = data;
          //console.log(data)
          if (data != null && data.responseCode == 1) {
            this.storage.set("RetireACCOUNT", "TRUE");
            this.storage.set("RUUID", dat.UUID);
            //   this.storage.set("primaryAccountNumber",dat.primaryAccountNumber);
            loader.dismiss();
            // this.showAlert(data);

            var datas = [
              { tital: "Status", desc: data.responseMessage },
              { tital: "SMS", desc: "An SMS will be sent shortly" }
            ];
            let modal = this.modalCtrl.create(
              "ReModelPage",
              { data: datas },
              { cssClass: "inset-modal" }
            );
            modal.present();
          } else {
            loader.dismiss();
            this.showAlert(data);
          }
        }
      );
    }
  }

  ComplateForm() {
    if (this.complate.valid) {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      var dat = this.complate.value;

      this.storage.get("RUUID").then(val => {
        if (val != null) {
          dat.originalTranUUID = val;

          dat.UUID = uuid.v4();
          dat.consumerPIN = this.GetServicesProvider.encrypt(
            dat.UUID + dat.consumerPIN
          );
          dat.consumerOTP = this.GetServicesProvider.encrypt(
            dat.UUID + dat.consumerOTP
          );
          dat.consumerIdentifier = this.consumerIdentifier;
          //console.log(dat.originalTranUUID)
          //console.log(dat.IPIN)

          this.GetServicesProvider.loadGmpp(
            this.complate.value,
            "ComplateRetirewallet"
          ).then(data => {
            this.bal = data;
            //console.log(data)
            if (data != null && data.responseCode == 1) {
              loader.dismiss();
              // this.showAlert(data);

              var datas = [{ tital: "Status", desc: data.responseMessage }];
              let modal = this.modalCtrl.create(
                "ReModelPage",
                { data: datas },
                { cssClass: "inset-modal" }
              );
              modal.present();
              this.Cancle();
            } else {
              loader.dismiss();
              this.showAlert(data);
            }
          });
        }
      });
    }
  }
}
