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

@IonicPage()
@Component({
  selector: "page-gmpp-change-pin",
  templateUrl: "gmpp-change-pin.html"
})
export class GmppChangePinPage {
  // consumerIdentifier: any;
  private bal: any;
  private todo: FormGroup;
  public cards: Card[] = [];

  public GetServicesProvider: GetServicesProvider;
  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    public alertCtrl: AlertController,
    public user: UserProvider,
    public storage: Storage,
    public modalCtrl: ModalController,
    public navCtrl: NavController
  ) {
    // this.consumerIdentifier = "249" + localStorage.getItem("username");

    //user.printuser();
    this.GetServicesProvider = GetServicesProviderg;
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
      oldPIN: ["", Validators.required],
      newPIN: ["", Validators.required],
      connewPIN: ["", Validators.required]
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
    if (this.todo.valid) {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      var dat = this.todo.value;
      if (dat.connewPIN == dat.newPIN) {
        dat.UUID = uuid.v4();
        dat.oldPIN = this.GetServicesProvider.encryptGmpp(
          dat.UUID + dat.oldPIN
        );
        dat.newPIN = this.GetServicesProvider.encryptGmpp(
          dat.UUID + dat.newPIN
        );
        dat.consumerIdentifier = dat.walletNumber;
        //console.log(dat)
        dat.isConsumer = "true";
        dat.connewPIN = "";
        this.GetServicesProvider.load(this.todo.value, "gmpp/changePIN").then(
          data => {
            this.bal = data;
            //console.log(data)
            if (data != null && data.responseCode == 1) {
              loader.dismiss();
              var datas = [{ tital: "Status", desc: data.responseMessage }];
              let modal = this.modalCtrl.create(
                "GmppReceiptPage",
                { data: datas },
                { cssClass: "inset-modals" }
              );
              modal.present();
            } else {
              loader.dismiss();
              this.showAlert(data);
              this.todo.reset();
            }
          }
        );
      } else {
        loader.dismiss();
        var data = { responseMessage: "" };
        data.responseMessage = "PIN Miss Match";
        this.showAlert(data);
      }
    }
  }
}
