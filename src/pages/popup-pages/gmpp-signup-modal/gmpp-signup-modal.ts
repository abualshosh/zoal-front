import { Component } from "@angular/core";
import {
  ViewController,
  IonicPage,
  AlertController,
  ModalController,
  NavController,
  LoadingController
} from "ionic-angular";
import { GetServicesProvider } from "../../../providers/get-services/get-services";
import * as uuid from "uuid";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Api } from "../../../providers/providers";
import { Wallet, StorageProvider } from "../../../providers/storage/storage";
@IonicPage()
@Component({
  selector: "page-gmpp-signup-modal",
  templateUrl: "gmpp-signup-modal.html"
})
export class GmppSignupModalPage {
  profile: any;
  private todo: FormGroup;
  public wallets: Wallet[];
  submitAttempt: boolean = false;

  constructor(
    public loadingCtrl: LoadingController,
    public api: Api,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public GetServicesProvider: GetServicesProvider,
    public storageProvider: StorageProvider,
    public modalCtrl: ModalController
  ) {
    this.storageProvider.getItems().then(wallets => {
      this.wallets = wallets;
      if (!this.wallets || this.wallets.length <= 0) {
        this.noWalletAvailable();
      }
    });

    this.todo = this.formBuilder.group({
      walletNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
          Validators.pattern("[249].[0-9]*")
        ])
      ]
    });
  }

  noWalletAvailable() {
    this.navCtrl.pop();
    let modal = this.modalCtrl.create(
      "WalkthroughModalPage",
      {},
      { cssClass: "inset-modals" }
    );
    modal.present();
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

  signup() {
    this.submitAttempt = true;
    let dat = this.todo.value;
    // var dat = {
    //   UUID: uuid.v4(),
    //   consumerIdentifier: "249" + localStorage.getItem("username")
    // };
    if (this.todo.valid) {
      dat.UUID = uuid.v4();
      dat.consumerIdentifier = dat.walletNumber;
      let loader = this.loadingCtrl.create();
      loader.present();

      this.GetServicesProvider.load(dat, "gmpp/registerConsumer").then(data => {
        loader.dismiss();

        if (data.responseCode == 1) {
          this.profile = JSON.parse(localStorage.getItem("profile"));
          this.profile.phoneNumber = "249" + localStorage.getItem("username");
          this.api.put("/profiles", this.profile).subscribe(
            (res: any) => {
              this.submitAttempt = false;
              localStorage.setItem("profile", JSON.stringify(this.profile));
              var datas = [{ tital: "Status", desc: data.responseMessage }];
              let modal = this.modalCtrl.create(
                "GmppReceiptPage",
                { data: datas },
                { cssClass: "inset-modals" }
              );
              modal.present();
              this.viewCtrl.dismiss();
            },
            err => {
              this.submitAttempt = false;
              //console.log(err);
            }
          );
        } else {
          this.submitAttempt = false;
          this.showAlert(data);
        }
      });
    }
  }

  dismiss() {
    this.profile = JSON.parse(localStorage.getItem("profile"));
    localStorage.setItem("profile", JSON.stringify(this.profile));
    this.viewCtrl.dismiss();
  }
}
