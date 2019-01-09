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
@IonicPage()
@Component({
  selector: "page-gmpp-signup-modal",
  templateUrl: "gmpp-signup-modal.html"
})
export class GmppSignupModalPage {
  profile: any;
  private todo: FormGroup;

  constructor(
    public loadingCtrl: LoadingController,
    public api: Api,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public GetServicesProvider: GetServicesProvider,
    public modalCtrl: ModalController
  ) {
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
    let dat = this.todo.value;
    // var dat = {
    //   UUID: uuid.v4(),
    //   consumerIdentifier: "249" + localStorage.getItem("username")
    // };
    dat.UUID = uuid.v4();
    dat.consumerIdentifier = dat.walletNumber;
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    this.GetServicesProvider.load(dat, "gmpp/registerConsumer").then(data => {
      loader.dismiss();

      if (data.responseCode == 1) {
        this.profile = JSON.parse(localStorage.getItem("profile"));
        this.profile.phoneNumber = "249" + localStorage.getItem("username");
        this.api.put("/profiles", this.profile).subscribe(
          (res: any) => {
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
            //console.log(err);
          }
        );
      } else {
        this.showAlert(data);
      }
    });
  }

  login() {
    this.navCtrl.push("GmppSwitchAccountPage");
    this.viewCtrl.dismiss();
  }

  dismiss() {
    this.profile = JSON.parse(localStorage.getItem("profile"));
    localStorage.setItem("profile", JSON.stringify(this.profile));
    this.viewCtrl.dismiss();
  }
}
