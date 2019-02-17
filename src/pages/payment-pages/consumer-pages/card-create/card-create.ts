import { Component } from "@angular/core";
import {
  IonicPage,
  ViewController,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";

import { Validators, FormBuilder, FormGroup } from "@angular/forms";

import { Storage } from "@ionic/storage";
import { Card } from "../../../../models/cards";

@IonicPage()
@Component({
  selector: "page-card-create",
  templateUrl: "card-create.html"
})
export class CardCreatePage {
  private todo: FormGroup;
  public cards: Card[] = [];
  public payee: any[] = [];
  submitAttempt: boolean = false;
  edit: boolean = false;

  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,

    public storage: Storage,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.storage.get("cards").then(val => {
      if (val) {
        this.cards = val;
      }
    });

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
      expDate: ["", Validators.required]
    });

    var card = this.navParams.get("card");
    if (card) {
      this.todo.get("PAN").setValue(card.pan);
      this.todo.get("expDate").setValue(card.expDate);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      var dat = this.todo.value;

      var date = new Date(dat.expDate);
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
