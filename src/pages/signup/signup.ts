import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  IonicPage,
  NavController,
  ToastController,
  LoadingController
} from "ionic-angular";

import { User } from "../../providers/providers";
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
    public translateService: TranslateService
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

  doSignup() {
    // Attempt to login in through our User service
    this.submitAttempt = true;

    if (this.signup.valid) {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      this.account.password = this.signup.controls["PHONENUMBER"].value;
      this.account.login = this.signup.controls["PHONENUMBER"].value;
      this.user.login(this.account).subscribe(
        resp => {
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: this.signupErrorString,
            duration: 3000,
            position: "top"
          });
          toast.present();
          this.submitAttempt = false;
        },
        err => {
          this.user.sendOtp(this.account).subscribe(
            (res: any) => {
              loader.dismiss();
              if (res.success == true) {
                this.navCtrl.setRoot("VlidateOtpPage", {
                  username: this.account.username,
                  OtpType: "signup"
                });
              }
              this.submitAttempt = false;
            },
            err => {
              console.error("ERROR", err);
              this.submitAttempt = false;
            }
          );
        }
      );
    }
  }
}
