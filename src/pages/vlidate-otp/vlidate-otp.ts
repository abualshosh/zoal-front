import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  ToastController
} from "ionic-angular";
import { User } from "../../providers/providers";
import { MainPage } from "../pages";
import { TranslateService } from "@ngx-translate/core";
/**
 * Generated class for the VlidateOtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-vlidate-otp",
  templateUrl: "vlidate-otp.html"
})
export class VlidateOtpPage {
  account: { login: string; otp: string } = {
    login: "",

    otp: "test"
  };

  otpType: any;
  otpErrorString: String;

  constructor(
    public user: User,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public translateService: TranslateService
  ) {
    this.account.login = navParams.get("username");
    this.otpType = navParams.get("OtpType");

    this.translateService.get("OTP_ERROR").subscribe(value => {
      this.otpErrorString = value;
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

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  vlidate() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    this.user.validateOtp(this.account).subscribe(
      (res: any) => {
        if (res) {
          if (this.otpType === "login") {
            loader.dismiss();
            localStorage.setItem("logdin", "true");
            this.navCtrl.setRoot(MainPage);
          } else {
            loader.dismiss();
            this.navCtrl.setRoot("ItemCreatePage", {
              username: this.account.login
            });
          }
        } else {
          loader.dismiss();
          this.showToast(this.otpErrorString);
        }
      },
      err => {
        console.error("ERROR", err);
        loader.dismiss();
        this.showAlert(err);
      }
    );
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad VlidateOtpPage');
  }
}
