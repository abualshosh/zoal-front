import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { User } from "../../../providers/providers";
import { MainPage } from "../../pages";
import { TranslateService } from "@ngx-translate/core";
import { AlertProvider } from "../../../providers/alert/alert";

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

  constructor(
    public user: User,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public translateService: TranslateService
  ) {
    this.account.login = navParams.get("username");
    this.otpType = navParams.get("OtpType");
  }

  validateOtp() {
    this.alertProvider.showLoading();

    this.user.validateOtp(this.account).subscribe(
      (res: any) => {
        if (this.otpType === "login") {
          this.alertProvider.hideLoading();
          localStorage.setItem("logdin", "true");
          this.navCtrl.setRoot(MainPage);
        } else {
          this.alertProvider.hideLoading();
          this.navCtrl.setRoot("ProfileEditPage");
        }
      },
      err => {
        console.error("ERROR", err);
        this.alertProvider.hideLoading();
        this.alertProvider.showAlert(err);
      }
    );
  }
}
