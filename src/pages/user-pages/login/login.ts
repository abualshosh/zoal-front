import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IonicPage, NavController } from "ionic-angular";
import { User } from "../../../providers/providers";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertProvider } from "../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  account: { username: string; password: string; rememberMe: boolean } = {
    username: "",
    password: "test",
    rememberMe: true
  };

  private login: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public user: User,
    public alertProvider: AlertProvider,
    private formBuilder: FormBuilder,
    public translateService: TranslateService
  ) {
    this.login = this.formBuilder.group({
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

  doLogin() {
    this.submitAttempt = true;

    if (this.login.valid) {
      this.alertProvider.showLoading();

      this.account.username = this.login.controls["PHONENUMBER"].value;
      this.account.username = this.account.username.substring(
        1,
        this.account.username.length
      );

      this.account.password = this.account.username;
      this.account.rememberMe = true;

      this.user.sendOtpLogin({ login: this.account.username }).subscribe(
        (res: any) => {
          if (res.success) {
            this.alertProvider.hideLoading();
            this.submitAttempt = false;
            this.navCtrl.push("VlidateOtpPage", {
              username: this.account.username,
              OtpType: "login"
            });
          } else {
            this.alertProvider.hideLoading();
            this.submitAttempt = false;
            this.alertProvider.showAlert("failedToSendOTP", true);
          }
        },
        err => {
          this.alertProvider.hideLoading();
          this.submitAttempt = false;
          this.alertProvider.showAlert("failedToLogin", true);
        }
      );
    }
  }
}
