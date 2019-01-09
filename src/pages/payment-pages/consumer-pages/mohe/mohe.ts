import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import * as moment from "moment";

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
 * Generated class for the MohePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-mohe",
  templateUrl: "mohe.html"
})
export class MohePage {
  profile: any;
  showWallet: boolean = false;
  private bal: any;
  private todo: FormGroup;
  public cards: Card[] = [];
  public payee: any[] = [];
  public isArab = false;
  validCard: boolean = false;

  public title: any;
  submitAttempt: boolean = false;
  CourseIDs: Array<{ title: string; id: any }> = [
    { title: "Academic", id: "1" },
    { title: "Agricultural", id: "2" },
    { title: "commercial", id: "3" },
    { title: "Industrial", id: "4" },
    { title: "Womanly", id: "5" },
    { title: "Ahlia", id: "6" },
    { title: "Readings", id: "7" }
  ];
  FormKinds: Array<{ title: string; id: any }> = [
    { title: "General admission-first round", id: "1" },
    { title: "Specialadmission", id: "2" },
    { title: "Sons of higher education staff", id: "3" },
    { title: "General admission-second round", id: "6" },
    { title: "Special admission-vacant seats", id: "7" },
    { title: "Private institutions direct admission", id: "8" },
    { title: "Diploma in public institutions", id: "9" }
  ];

  public type: any = "mohe";
  isGmpp: boolean;

  constructor(
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
      this.cards = val;
      // if (this.cards) {
      //   if (this.cards.length <= 0) {
      //     this.showWallet = true;
      //     this.todo.controls["mobilewallet"].setValue(true);
      //   }
      // } else {
      //   this.showWallet = true;
      //   this.todo.controls["mobilewallet"].setValue(true);
      // }
      this.isGmpp = this.navParams.get("isGmpp");
      if (this.isGmpp) {
        this.showWallet = true;
        this.todo.controls["mobilewallet"].setValue(true);
      } else {
        this.showWallet = false;
        this.todo.controls["mobilewallet"].setValue(false);
      }
    });

    //this.title=this.navParams.get("name");
    //user.printuser();

    this.todo = this.formBuilder.group({
      pan: [""],
      Card: [""],
      Payee: [""],
      entityId: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
          Validators.pattern("[249][0-9]*")
        ])
      ],
      CourseID: ["", Validators.required],
      FormKind: ["", Validators.required],
      IPIN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ],
      SETNUMBER: ["", Validators.required],
      STUCNAME: ["", Validators.required],
      STUCPHONE: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern("[0-9]*")
        ])
      ],
      Amount: ["", Validators.required],
      mobilewallet: [""]
    });
    this.todo.controls["mobilewallet"].setValue(false);
    // this.todo.controls["entityId"].setValue(
    //   "249" + localStorage.getItem("username")
    // );
  }

  clearInput() {
    this.todo.controls["pan"].reset();
    this.todo.controls["Card"].reset();
    this.todo.controls["entityId"].reset();
    this.todo.controls["Payee"].reset();
    this.todo.controls["IPIN"].reset();
    this.todo.controls["CourseID"].reset();
    this.todo.controls["FormKind"].reset();
    this.todo.controls["SETNUMBER"].reset();
    this.todo.controls["STUCNAME"].reset();
    this.todo.controls["STUCPHONE"].reset();
    this.todo.controls["Amount"].reset();
    if (this.cards) {
      if (this.cards.length <= 0) {
        this.showWallet = true;
        this.todo.controls["mobilewallet"].setValue(true);
      }
    } else {
      this.showWallet = true;
      this.todo.controls["mobilewallet"].setValue(true);
    }
  }

  ionViewWillEnter() {}

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

  WalletAvalible(event) {
    this.profile = JSON.parse(localStorage.getItem("profile"));
    // if (!this.profile.phoneNumber) {
    //   let modal = this.modalCtrl.create(
    //     "GmppSignupModalPage",
    //     {},
    //     { cssClass: "inset-modals" }
    //   );
    //   modal.present();
    //   this.todo.reset();

    //   this.showWallet = true;
    // } else
    if (this.cards) {
      if (this.cards.length <= 0) {
        this.showWallet = true;
        let modal = this.modalCtrl.create(
          "AddCardModalPage",
          {},
          { cssClass: "inset-modals" }
        );
        modal.present();
      }
    } else {
      this.showWallet = true;

      let modal = this.modalCtrl.create(
        "AddCardModalPage",
        {},
        { cssClass: "inset-modals" }
      );
      modal.present();
    }
  }

  onSelectChange(selectedValue: any) {
    var dat = this.todo.value;
    if (dat.Card && !dat.mobilewallet) {
      this.validCard = true;
    }
  }

  logForm() {
    var dat = this.todo.value;
    if (dat.Card && !dat.mobilewallet) {
      this.validCard = true;
    }
    this.submitAttempt = true;
    if (this.todo.valid) {
      if (!dat.mobilewallet && !this.validCard) {
        return;
      }
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.IPIN = this.GetServicesProvider.encrypt(dat.UUID + dat.IPIN);
      //console.log(dat.IPIN)
      dat.tranCurrency = "SDG";

      dat.tranAmount = dat.Amount;
      if (dat.mobilewallet) {
        dat.entityType = "Mobile Wallet";

        dat.authenticationType = "10";
        dat.pan = "";
      } else {
        dat.pan = dat.Card.pan;
        dat.expDate = dat.Card.expDate;
        dat.authenticationType = "00";
        dat.entityId = "";
      }
      dat.fromAccountType = "00";
      dat.toAccountType = "00";
      if (this.type === "moheArab") {
        dat.payeeId = "Higher Education Arab";
        dat.paymentInfo =
          "STUCNAME=" +
          dat.STUCNAME +
          "/STUCPHONE=" +
          dat.STUCPHONE +
          "/STUDCOURSEID=" +
          dat.CourseID.id +
          "/STUDFORMKIND=" +
          dat.FormKind.id;
      } else {
        dat.payeeId = "Higher Education";
        dat.paymentInfo =
          "SETNUMBER=" +
          dat.SETNUMBER +
          "/STUDCOURSEID=" +
          dat.CourseID.id +
          "/STUDFORMKIND=" +
          dat.FormKind.id;
      }
      this.title = dat.payeeId;
      //console.log(dat)
      this.GetServicesProvider.load(dat, "consumer/payment").then(data => {
        this.bal = data;
        //console.log(data)
        if (data != null && data.responseCode == 0) {
          loader.dismiss();
          var datas;
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );

          datas = {
            acqTranFee: data.acqTranFee,
            issuerTranFee: data.issuerTranFee,
            tranAmount: data.tranAmount,
            tranCurrency: data.tranCurrency,
            date: datetime
          };

          var main = [];
          var mainData = {
            [this.title]: data.tranAmount
          };
          main.push(mainData);
          var dat = [];
          if (data.PAN) {
            dat.push({ Card: data.PAN });
          } else {
            dat.push({ WalletNumber: data.entityId });
          }

          if (Object.keys(data.billInfo).length > 0) {
            if (this.type !== "moheArab") {
              data.billInfo.SETNUMBER = this.todo.controls["SETNUMBER"].value;
            }
            dat.push(data.billInfo);
          }
          dat.push(datas);
          let modal = this.modalCtrl.create(
            "TransactionDetailPage",
            { data: dat, main: main },
            { cssClass: "inset-modal" }
          );
          modal.present();
          this.clearInput();
          this.submitAttempt = false;
          // this.todo.controls["entityId"].setValue(
          //   "0" + localStorage.getItem("username")
          // );
        } else {
          loader.dismiss();

          this.showAlert(data);
          this.clearInput();
          this.submitAttempt = false;
          // this.todo.controls["entityId"].setValue(
          //   "0" + localStorage.getItem("username")
          // );
        }
      });
    }
  }
}
