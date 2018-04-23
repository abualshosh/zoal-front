import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController,LoadingController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { username: string,login :string, password: string } = {
    username: '',
    login:'',
    password: 'test'
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
    // Attempt to login in through our User service
   
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.account.password=this.account.username;
    this.account.login=this.account.username;
    this.user.login(this.account).subscribe((resp) => {
      loader.dismiss();
         let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
  
     }, err => {
      this.user.sendOtp(this.account).subscribe((res: any) => {
        loader.dismiss();
        if(res.success==true){
  
          this.navCtrl.setRoot('VlidateOtpPage',{"username" : this.account.username,"OtpType":"signup"});
        }
     }  , err => {
      console.error('ERROR', err);
    }
    
    );
    
    });
   

    // this.user.signup(this.account).subscribe((resp) => {
    //
    //
    //   this.navCtrl.push(MainPage);
    // }, (err) => {
    //
    //   this.navCtrl.push(MainPage);
    //
    //   // Unable to sign up
    //   let toast = this.toastCtrl.create({
    //     message: this.signupErrorString,
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    // });
  }
}
