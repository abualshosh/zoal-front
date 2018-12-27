import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  IonicPage,
  NavController,
  ToastController,
  LoadingController
} from "ionic-angular";
import { User } from "../../../providers/providers";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  account: { username: string; password: string } = {
    username: "",
    password: "test"
  };

  userInfo: { country_code: string; phoneNumber: string } = {
    country_code: "",
    phoneNumber: "test"
  };

  private login: FormGroup;
  submitAttempt: boolean = false;

  // Our translated text strings
  private loginErrorString: string;

  constructor(
    public navCtrl: NavController,
    public user: User,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    public translateService: TranslateService
  ) {
    this.login = this.formBuilder.group({
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

    this.translateService.get("LOGIN_ERROR").subscribe(value => {
      this.loginErrorString = value;
    });
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  doLogin() {
    this.submitAttempt = true;
    if (this.login.valid) {
      this.account.username = this.login.controls["PHONENUMBER"].value;
      this.account.password = this.account.username;

      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();

      this.user.login(this.account).subscribe(
        resp => {
          this.user.sendOtp({ login: this.account.username }).subscribe(
            (res: any) => {
              //console.log(res);
              if (res.success) {
                loader.dismiss();
                this.submitAttempt = false;
                this.navCtrl.setRoot("VlidateOtpPage", {
                  username: this.account.username,
                  OtpType: "login"
                });
              } else {
                loader.dismiss();
                this.submitAttempt = false;
                this.showToast(this.loginErrorString);
              }
            },
            err => {
              loader.dismiss();
              this.submitAttempt = false;
              console.error("ERROR", err);
            }
          );
        },
        err => {
          //this.navCtrl.push(MainPage);
          // Unable to log in
          loader.dismiss();
          this.submitAttempt = false;
          this.showToast(this.loginErrorString);
        }
      );
    }
  }
}
