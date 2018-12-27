import { Component } from "@angular/core";
import { IonicPage, NavController, ModalController } from "ionic-angular";
import { UserProvider } from "../../../../providers/user/user";
import { Card } from "../../../../models/cards";
import { AlertController } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { CardIO } from "@ionic-native/card-io";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: "page-card-detail",
  templateUrl: "card-detail.html"
})
export class CardDetailPage {
  private todo: FormGroup;
  public cards: Card[] = [];
  public selectedCard: Card = new Card("", "", "", "", false);
  submitAttempt: boolean = false;
  found: boolean = false;

  deleteMessage: string;
  confirmDeleteMessage: string;
  submitMessage: string;
  closeMessage: string;

  constructor(
    private cardIO: CardIO,
    private formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public user: UserProvider,
    public storage: Storage,
    public translateService: TranslateService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
    //this.storage.set('cards',this.cards);
    this.todo = this.formBuilder.group({
      PAN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(16),
          Validators.pattern("[0-9]*")
        ])
      ],
      expDate: ["", Validators.required]
    });

    translateService
      .get(["confirmDelete", "delete", "Submit", "close"])
      .subscribe(values => {
        this.confirmDeleteMessage = values["confirmDelete"];
        this.deleteMessage = values["delete"];
        this.submitMessage = values["Submit"];
        this.closeMessage = values["close"];
      });

    this.storage.get("cards").then(val => {
      this.cards = val;
      this.storage.set("cards", this.cards);
      //this.cards=this.user.cards;

      if (this.cards) {
        if (val.length > 0) {
          this.select(this.cards[0]);
        } else {
          this.selectedCard = new Card(
            "              ",
            "                 ",
            "    ",
            "   ",
            false
          );
          this.AddCardModel();
        }
      } else {
        this.selectedCard = new Card(
          "              ",
          "                 ",
          "    ",
          "   ",
          false
        );
        this.AddCardModel();
      }
      //console.log(this.selectedCard.pan);
    });
  }

  Scan() {
    this.cardIO.canScan().then((res: boolean) => {
      if (res) {
        let options = {
          requireExpiry: false,
          requireCVV: false,
          requirePostalCode: false
        };
        this.cardIO.scan(options).then(
          data => {
            alert(JSON.stringify(data));
            //console.log("CONSOLEEEE   >>>>>> " + data.postalCode)
          },
          err => {
            //console.log(err);
            // An error occurred
          }
        );
      }
    });
  }

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      var dat = this.todo.value;

      //console.log(dat.expDate.substring(2,4)+dat.expDate.substring(5));
      var date = new Date(dat.expDate);

      var mon = "" + (date.getMonth() + 1);
      if (mon.length == 1) {
        mon = "0" + mon;
      }

      this.storage.get("cards").then(val => {
        if (val === null) {
          val = this.cards;
        }
        var i: any;
        for (i = 0; i < val.length; i++) {
          if (val[i].pan === dat.PAN) {
            val[i].pan = dat.PAN;
            val[i].expDate =
              date
                .getFullYear()
                .toString()
                .substring(2, 4) + mon;
            this.storage.set("cards", val);
            this.cards = val;
            this.found = true;
          }
        }
        if (!this.found) {
          this.cards.splice(
            0,
            0,
            new Card(
              dat.CARDNAME,
              dat.PAN,
              "XXXXXXXXXX" + dat.PAN.substring(10),
              date
                .getFullYear()
                .toString()
                .substring(2, 4) + mon,
              false
            )
          );
          this.storage.set("cards", this.cards);
          this.found = false;
        }
        this.storage.set("cards", this.cards);
      });

      this.submitAttempt = false;
    }
  }

  select(card) {
    this.selectedCard = card;
    var i: any;
    for (i = 0; i < this.cards.length; i++) {
      this.cards[i].selected = false;
    }

    card.selected = true;
    this.storage.set("cards", this.cards);
    //this.selectedCard.selected=true;
  }

  delectCard(card: Card) {
    let confirm = this.alertCtrl.create({
      title: this.deleteMessage,
      message: this.confirmDeleteMessage + " " + card.pan,
      buttons: [
        {
          text: this.submitMessage,
          handler: () => {
            this.storage.get("cards").then(val => {
              var i: any;
              for (i = 0; i < this.cards.length; i++) {
                if (this.cards[i].pan === card.pan) {
                  this.cards.splice(i, 1);
                  this.selectedCard = new Card(
                    "        ",
                    "         ",
                    "   ",
                    "    ",
                    false
                  );
                }
              }
              this.storage.set("cards", this.cards);
            });
          }
        },
        {
          text: this.closeMessage,
          handler: () => {
            //  //console.log('Agree clicked');
          }
        }
      ],
      cssClass: "alertCustomCss"
    });
    confirm.present();
  }

  editCard() {
    let modal = this.modalCtrl.create(
      "CardCreatePage",
      { card: this.selectedCard },
      { cssClass: "inset-modal-box" }
    );
    modal.onDidDismiss(data => {
      this.storage.get("cards").then(val => {
        this.cards = val;
        this.storage.set("cards", this.cards);
        //this.cards=this.user.cards;
        if (this.cards) {
          this.select(this.cards[0]);
        } else {
          this.selectedCard = new Card("", "", "", "", false);
        }
        //console.log(this.selectedCard.pan);
      });
    });
    modal.present();
  }

  AddCardModel() {
    let modal = this.modalCtrl.create("CardCreatePage", null, {
      cssClass: "inset-modal-box"
    });
    modal.onDidDismiss(data => {
      this.storage.get("cards").then(val => {
        this.cards = val;
        this.storage.set("cards", this.cards);
        //this.cards=this.user.cards;
        if (this.cards) {
          if (val.length > 0) {
            this.select(this.cards[0]);
          } else {
            this.selectedCard = new Card(
              "          ",
              "           ",
              "            ",
              "           ",
              false
            );
          }
        } else {
          this.selectedCard = new Card(
            "              ",
            "             ",
            "             ",
            "               ",
            false
          );
        }
        //console.log(this.selectedCard.pan);
      });
    });
    modal.present();
    //this.todo.clear();
    //   this.selectedCard=0;
  }

  AddCard() {
    let alert = this.alertCtrl.create({
      title: "Add Card",
      inputs: [
        {
          name: "PAN",
          placeholder: "PAN"
        },
        {
          name: "Expdate",
          placeholder: "Exprtion Date"
        }
      ],
      cssClass: "alertCustomCss"
    });

    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data.PAN.length > 0 && data.Expdate.length > 0) {
          this.storage.get("cards").then(val => {
            //console.log(val);

            this.storage.set("cards", this.cards);
          });
        } else {
          this.presentToast();
        }
      }
    });
    alert.present();
  }

  save(card: Card) {
    this.storage.get("cards").then(val => {
      //console.log(val);
      var i: any;
      for (i = 0; i < val.length; i++) {
        if (val[i].pan === card.pan) {
          val[i] = card;
          val[i].CARDNAME = card.pan;
          this.storage.set("cards", val);
          this.cards = val;
        } else {
          this.storage.set("cards", this.cards);
        }
      }
      this.storage.set("cards", this.cards);
    });
  }

  enabled(card: Card) {
    var ret = "false";
    this.storage.get("cards").then(val => {
      var i: any;
      for (i = 0; i < val.length; i++) {
        if (val[i] === card) {
          return "false";
        } else {
          ret = "true";
        }
      }
    });
    if (ret == "true") {
      return "true";
    }
    return "false";
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: "Some Fileds are Missing",
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }
}
