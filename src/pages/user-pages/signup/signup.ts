import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  IonicPage,
  NavController,
  ToastController,
  LoadingController,
  AlertController
} from "ionic-angular";

import { User } from "../../../providers/providers";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
  account: { username: string; login: string; password: string } = {
    username: "",
    login: "",
    password: "test"
  };

  private signup: FormGroup;
  submitAttempt: boolean = false;

  private signupErrorString: string;

  constructor(
    public navCtrl: NavController,
    public user: User,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public alertCtrl: AlertController
  ) {
    this.signup = this.formBuilder.group({
      PHONENUMBER: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern("[0-9]*")
        ])
      ]
    });

    this.translateService.get("SIGNUP_ERROR").subscribe(value => {
      this.signupErrorString = value;
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

  doSignup() {
    this.submitAttempt = true;

    if (this.signup.valid) {
      let loader = this.loadingCtrl.create();
      loader.present();

      this.account.password = this.signup.controls["PHONENUMBER"].value;
      this.account.login = this.signup.controls["PHONENUMBER"].value;
      this.account.username = this.signup.controls["PHONENUMBER"].value;

      this.user.login(this.account).subscribe(
        resp => {
          loader.dismiss();
          this.showToast(this.signupErrorString);
          this.submitAttempt = false;
        },
        err => {
          this.user.sendOtp(this.account).subscribe(
            (res: any) => {
              if (res.success == true) {
                loader.dismiss();
                this.navCtrl.setRoot("VlidateOtpPage", {
                  username: this.account.username,
                  OtpType: "signup"
                });
              } else {
                loader.dismiss();
                this.showToast(this.signupErrorString);
                this.submitAttempt = false;
              }
              this.submitAttempt = false;
            },
            err => {
              console.error("ERROR", err);
              loader.dismiss();
              this.showAlert(err);
              this.submitAttempt = false;
            }
          );
        }
      );
    }
  }
}
