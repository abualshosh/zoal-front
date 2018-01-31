import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AccountKit, AuthResponse } from 'ng2-account-kit';
import { User } from '../../providers/providers';
import { MainPage } from '../pages';

declare var AccountKitPlugin:any;

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { username: string, password: string } = {
    username: '',

    password: 'test'
  };
  userInfo: { country_code: string, phoneNumber: string } = {
    country_code: '',

    phoneNumber: 'test'
  };
 
  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,

    public toastCtrl: ToastController,
    public translateService: TranslateService) {


    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  register() {
    
      (<any>window).AccountKitPlugin.loginWithPhoneNumber({
        useAccessToken: true,
        defaultCountryCode: "IN",
        facebookNotificationsEnabled: true,
      }, data => {
      (<any>window).AccountKitPlugin.getAccount(
        info => this.userInfo = info,
        err => console.log(err));
      });
    
  }
  Login(): void {
    console.log('ddddddddd')
      AccountKit.login('PHONE', { countryCode: '+249', phoneNumber: this.account.username }).then(
        (response: AuthResponse) => console.log(response),
        (error: any) => console.error(error)
      );
    }
  // Attempt to login in through our User service
  doLogin() {
   this.account.password=this.account.username;
    this.user.login(this.account).subscribe((resp) => {

      this.user.sendOtp({"login":this.account.username}).subscribe((res: any) => {
        console.log(res);
        if(res.success){

        this.navCtrl.setRoot('VlidateOtpPage',{"username":this.account.username,"OtpType":"login"});
        }else{
          let toast = this.toastCtrl.create({
            message: this.loginErrorString,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
       }, err => {
         console.error('ERROR', err);
       });
     
    }, (err) => {
      //this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
