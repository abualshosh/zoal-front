import { Component } from "@angular/core";
import {
  IonicPage,
  ViewController,
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
 * Generated class for the ZaintopupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-add-card-model",
  templateUrl: "add-card-model.html"
})
export class AddCardModelPage {
  private bal: any;
  private todo: FormGroup;
  public cards: Card[] = [];
  public payee: any[] = [];
  submitAttempt: boolean = false;
  edit: boolean = false;

  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProvider: GetServicesProvider,
    public alertCtrl: AlertController,
    public user: UserProvider,
    public storage: Storage,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.storage.get("cards").then(val => {
      if (val) {
        this.cards = val;
      }
    });

    //user.printuser();

    this.todo = this.formBuilder.group({
      PAN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(19),
          Validators.pattern("[0-9]*")
        ])
      ],
      //  CARDNAME: ['',Validators.required],
      expDate: ["", Validators.required]
    });

    var card = this.navParams.get("card");
    if (card) {
      this.todo.get("PAN").setValue(card.pan);
      this.todo.get("expDate").setValue(card.expDate);
    }
  }

  showAlert(balance: any) {
    let alert = this.alertCtrl.create({
      title: "ERROR",
      message: balance.responseMessage,

      buttons: ["OK"],
      cssClass: "alertCustomCss"
    });
    alert.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      var dat = this.todo.value;

      //console.log(dat.expDate.substring(2,4)+dat.expDate.substring(5));
      var date = new Date(dat.expDate);
      //console.log();
      //console.log();
      this.storage.get("cards").then(val => {
        var mon = "" + (date.getMonth() + 1);
        if (mon.length == 1) {
          mon = "0" + mon;
        }
        if (val) {
          var i: any;
          for (i = 0; i < val.length; i++) {
            if (val[i].pan === dat.PAN) {
              var card = this.navParams.get("card");
              if (card) {
                val[i].expDate = card.expDate;
              } else {
                val[i].expDate =
                  date
                    .getFullYear()
                    .toString()
                    .substring(2, 4) + mon;
              }

              this.edit = true;
              this.cards = val;
            }
          }
        }
        //   }}else{
        //  this.cards.push(  new Card(dat.PAN,dat.PAN,"XXXXXXXXXX"+dat.PAN.substring(10),date.getFullYear().toString().substring(2,4)+mon,false)
        // );
        //   }
        if (!this.edit) {
          this.cards.splice(
            0,
            0,

            new Card(
              dat.PAN,
              dat.PAN,
              "XXXXXXXXXX" + dat.PAN.substring(10),
              date
                .getFullYear()
                .toString()
                .substring(2, 4) + mon,
              false
            )
          );
          this.edit = false;
        }
        this.storage.set("cards", this.cards);
      });
      this.viewCtrl.dismiss();
      this.submitAttempt = false;
    }
  }
}
