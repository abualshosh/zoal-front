import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IonicPage, NavController, LoadingController } from "ionic-angular";

import { User } from "../../../providers/providers";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertProvider } from "../../../providers/alert/alert";

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

  constructor(
    public navCtrl: NavController,
    public user: User,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public translateService: TranslateService,
    public alertProvider: AlertProvider
  ) {
    this.signup = this.formBuilder.group({
      PHONENUMBER: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern("0[0-9]*")
        ])
      ]
    });
  }

  doSignup() {
    this.submitAttempt = true;

    if (this.signup.valid) {
      let loader = this.loadingCtrl.create();
      loader.present();

      this.account.login = this.signup.controls["PHONENUMBER"].value;
      this.account.login = this.account.login.substring(
        1,
        this.account.login.length
      );

      this.account.password = this.account.login;
      this.account.username = this.account.login;

      console.log(this.account);

      this.user.login(this.account).subscribe(
        resp => {
          loader.dismiss();
          this.alertProvider.showAlert("failedToSignup", true);
          this.submitAttempt = false;
        },
        err => {
          this.user.sendOtp(this.account).subscribe(
            (res: any) => {
              if (res.success == true) {
                loader.dismiss();
                this.navCtrl.push("VlidateOtpPage", {
                  username: this.account.username,
                  OtpType: "signup"
                });
              } else {
                loader.dismiss();
                this.alertProvider.showAlert("failedToSendOTP", true);
                this.submitAttempt = false;
              }
              this.submitAttempt = false;
            },
            err => {
              loader.dismiss();
              this.alertProvider.showAlert("failedToSendOTP", true);
              this.submitAttempt = false;
            }
          );
        }
      );
    }
  }
}
