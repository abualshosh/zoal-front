import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IonicPage, NavController, LoadingController } from "ionic-angular";
import { User } from "../../../providers/providers";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertProvider } from "../../../providers/alert/alert";

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

  private login: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public user: User,
    public loadingCtrl: LoadingController,
    public alertProvider: AlertProvider,
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
  }

  doLogin() {
    this.submitAttempt = true;
    if (this.login.valid) {
      this.account.username = this.login.controls["PHONENUMBER"].value;
      this.account.password = this.account.username;

      let loader = this.loadingCtrl.create();
      loader.present();

      this.user.login(this.account).subscribe(
        resp => {
          this.user.sendOtp({ login: this.account.username }).subscribe(
            (res: any) => {
              if (res.success) {
                loader.dismiss();
                this.submitAttempt = false;
                this.navCtrl.push("VlidateOtpPage", {
                  username: this.account.username,
                  OtpType: "login"
                });
              } else {
                loader.dismiss();
                this.submitAttempt = false;
                this.alertProvider.showAlert("failedToSendOTP", true);
              }
            },
            err => {
              loader.dismiss();
              this.submitAttempt = false;
              this.alertProvider.showAlert("failedToSendOTP", true);
            }
          );
        },
        err => {
          loader.dismiss();
          this.submitAttempt = false;
          this.alertProvider.showAlert("failedToLogin", true);
        }
      );
    }
  }
}
