import { Component } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import {
  LoadingController,
  ModalController,
  IonicPage,
  NavController
} from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";

import * as uuid from "uuid";
import { UserProvider } from "../../../../providers/user/user";
import { Storage } from "@ionic/storage";
import { Card } from "../../../../models/cards";
import * as moment from "moment";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-get-balance",
  templateUrl: "get-balance.html"
})
export class GetBalancePage {
  private todo: FormGroup;
  public cards: Card[] = [];
  submitAttempt: boolean = false;
  public GetServicesProvider: GetServicesProvider;

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    public navCtrl: NavController,
    public user: UserProvider,
    public storage: Storage,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController
  ) {
    this.storage.get("cards").then(val => {
      this.cards = val;
      if (!this.cards || this.cards.length <= 0) {
        this.noCardAvailable();
      }
    });

    //  user.printuser();
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

      dat.UUID = uuid.v4();
      dat.IPIN = this.GetServicesProvider.encrypt(dat.UUID + dat.IPIN);
      
      dat.tranCurrency = "SDG";

      dat.authenticationType = "00";
      dat.fromAccountType = "00";
      dat.pan = dat.Card.pan;
      dat.expDate = dat.Card.expDate;
      
      this.GetServicesProvider.load(dat, "consumer/getBalance").then(data => {
        
        if (data != null && data.responseCode == 0) {
          loader.dismiss();
          var main = [];
          var mainData = {
            balance: data.balance.available
          };
          main.push(mainData);
          var datas;
          var dat = [];
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );
          datas = {
            Card: data.PAN,
            balance: data.balance.available,
            date: datetime
          };
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
          loader.dismiss();
          if (data.responseCode != null) {
            this.alertProvider.showAlert(data);
          } else {
            data.responseMessage = "Connection Error";
            this.alertProvider.showAlert(data);
          }
          this.todo.reset();
          this.submitAttempt = false;
        }
      });
    }
  }
}
