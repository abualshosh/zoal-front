import { Component } from "@angular/core";
import { IonicPage, NavController, ModalController } from "ionic-angular";

import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";

import * as uuid from "uuid";
import { UserProvider } from "../../../../providers/user/user";
import { Storage } from "@ionic/storage";
import { Card } from "../../../../models/cards";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-change-ipin",
  templateUrl: "change-ipin.html"
})
export class ChangeIpinPage {
  private todo: FormGroup;
  public cards: Card[] = [];
  submitAttempt: boolean = false;
  public GetServicesProvider: GetServicesProvider;

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    
    public user: UserProvider,
    public storage: Storage,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public navCtrl: NavController
  ) {
    this.storage.get("cards").then(val => {
      this.cards = val;
      if (!this.cards || this.cards.length <= 0) {
        this.noCardAvailable();
      }
    });

    //user.printuser();
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
      newIPIN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ],
      ConnewIPIN: [
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

  noCardAvailable() {
    this.navCtrl.pop();
    let modal = this.modalCtrl.create(
      "AddCardModalPage",
      {},
      { cssClass: "inset-modals" }
    );
    modal.present();
  }

  

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      let loader = this.loadingCtrl.create();

      loader.present();
      var dat = this.todo.value;
      //console.log(dat.IPIN)
      //console.log(dat.newIPIN)
      if (dat.ConnewIPIN == dat.newIPIN) {
        dat.UUID = uuid.v4();
        dat.IPIN = this.GetServicesProvider.encrypt(dat.UUID + dat.IPIN);
        dat.newIPIN = this.GetServicesProvider.encrypt(dat.UUID + dat.newIPIN);
        //console.log(dat.IPIN)

        dat.authenticationType = "00";
        dat.pan = dat.Card.pan;
        dat.expDate = dat.Card.expDate;
        //console.log(dat)
        dat.ConnewIPIN = "";
        this.GetServicesProvider.load(
          this.todo.value,
          "consumer/ChangeIPIN"
        ).then(data => {
          //console.log(data)
          if (data != null && data.responseCode == 0) {
            loader.dismiss();
            var datas = [{ tital: "Status", desc: data.responseMessage }];
            let modal = this.modalCtrl.create(
              "GmppReceiptPage",
              { data: datas },
              { cssClass: "inset-modals" }
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
      } else {
        loader.dismiss();
        var data = { responseMessage: "IPIN Missmatch" };
        //data.responseMessage="IPIN Missmatch";
        this.alertProvider.showAlert(data);
      }
    }
  }
}
