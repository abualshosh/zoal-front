import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers/providers';
import { MainPage } from '../pages';
/**
 * Generated class for the VlidateOtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vlidate-otp',
  templateUrl: 'vlidate-otp.html',
})
export class VlidateOtpPage {
  account: { login: string, otp: string } = {
    login: '',

    otp: 'test'
  };
  otpType:any;
  constructor( public user: User,public navCtrl: NavController, public navParams: NavParams) {
    this.account.login=navParams.get("username");
    this.otpType=navParams.get("OtpType");
  }
  vlidate(){
    this.user.validateOtp(this.account).subscribe((res: any) => {
      console.log(res);
      if(res){
      if(this.otpType==="login"){
        localStorage.setItem('logdin',"true");
        this.navCtrl.setRoot(MainPage);
      }else{
        this.navCtrl.setRoot('ItemCreatePage',{"username" : this.account.login});      }
      }
      
     }, err => {
       console.error('ERROR', err);
     });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad VlidateOtpPage');
  }

}
