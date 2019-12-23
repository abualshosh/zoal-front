import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { User } from "../../../providers/providers";
import { MainPage } from "../../pages";
import { TranslateService } from "@ngx-translate/core";
import { AlertProvider } from "../../../providers/alert/alert";

declare var SMSRetriever: any;

@IonicPage()
@Component({
  selector: "page-vlidate-otp",
  templateUrl: "vlidate-otp.html"
})
export class VlidateOtpPage {
  @ViewChild('otp1') otp1;
  @ViewChild('otp2') otp2;
  @ViewChild('otp3') otp3;
  @ViewChild('otp4') otp4;

  otpchar1 = "";
  otpchar2 = "";
  otpchar3 = "";
  otpchar4 = "";

  account: { login: string; otp: string } = {
    login: "",
    otp: ""
  };

  otpType: any;

  constructor(
    public user: User,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public translateService: TranslateService,
    private platform: Platform
  ) {
    this.account.login = navParams.get("username");
    this.otpType = navParams.get("OtpType");
    this.start()
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.otp1.setFocus();
    }, 150);
  }

  start() {
    this.platform.ready().then(() => {
      if (typeof SMSRetriever !== 'undefined') {
        // SMSRetriever.getHashString((hash) => {
        //   alert(hash)
        // }, (err) => {
        //   console.log(err);
        // });

        SMSRetriever.startWatch((msg) => {
          document.addEventListener('onSMSArrive', (args: any) => {
            console.log(args);
            this.processSMS(args.message);
          });
        }, (err) => {
          console.log(err);
        });
      }
    });
  }

  processSMS(data) {
    this.account.otp = data.slice(4, 8);
    this.populateOtpFields();
    this.validateOtp();
  }

  validateOtp() {
    if (!this.account.otp) {
      this.account.otp = this.otpchar1 + this.otpchar2 + this.otpchar3 + this.otpchar4;
    }

    this.alertProvider.showLoading();

    this.user.validateOtp(this.account).subscribe(
      (res: any) => {
        if (this.otpType === "login") {
          localStorage.setItem("logdin", "true");
          this.navCtrl.setRoot(MainPage);
        } else {
          this.navCtrl.setRoot("ProfileEditPage");
        }
      },
      err => {
        this.alertProvider.hideLoading();
        this.alertProvider.showToast(err);
      },
      () => {
        this.alertProvider.hideLoading();
      }
    );
  }

  resendOtp() {
    this.account.otp = "";
    if (this.otpType === "login") {
      this.resendLoginOtp()
    } else {
      this.resendSignupOtp();
    }
  }

  resendLoginOtp() {
    this.user.sendOtpLogin(this.account).subscribe(
      (res: any) => {
        if (res.success) {
          this.alertProvider.showToast("sentOtp")
          this.start();
        } else {
          this.alertProvider.showToast("failedToSendOTP");
        }
      },
      err => {
        this.alertProvider.hideLoading();
      },
      () => {
        this.alertProvider.hideLoading();
      }
    );
  }

  resendSignupOtp() {
    this.user.sendOtpSignup(this.account).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.alertProvider.showToast("sentOtp")
          this.start();
        } else {
          this.alertProvider.showToast("failedToSendOTP");
        }
      },
      err => {
        this.alertProvider.hideLoading();
      },
      () => {
        this.alertProvider.hideLoading();
      }
    );
  }

  populateOtpFields() {
    this.otpchar1 = this.account.otp[0]
    this.otpchar2 = this.account.otp[1]
    this.otpchar3 = this.account.otp[2]
    this.otpchar4 = this.account.otp[3]
  }

  moveFocus(nextElement) {
    nextElement.setFocus();
  }
}
