import { Component } from '@angular/core';
import { ViewController, IonicPage,AlertController ,NavController} from 'ionic-angular';
import { GetServicesProvider } from '../../../providers/get-services/get-services';
import * as uuid from 'uuid';
import { Api } from '../../../providers/providers';
@IonicPage()
@Component({
  selector: 'page-signup-modal',
  templateUrl: 'signup-modal.html'
})
export class SignupModalPage {
  profile:any;
  slides = [
    {
      id: 1,
      imageUrl: 'assets/img/slides/square.png',
    },
    {
      id: 2,
      imageUrl: 'assets/img/slides/square-2.jpg',
    },
    {
      id: 3,
      imageUrl: 'assets/img/slides/square-3.jpg',
    },
  ];

  constructor(public api:Api,public navCtrl: NavController, public alertCtrl: AlertController,public viewCtrl: ViewController,public GetServicesProvider:GetServicesProvider) {
  }

  showAlert(balance : any ) {
    let alert = this.alertCtrl.create({
      title: balance.responseStatus,
      message: balance.responseMessage,

      buttons: ['OK'],
       cssClass: 'alertCustomCss'
    });
    alert.present();
  }
  signup() {
    var dat={
      UUID:uuid.v4(),
      consumerIdentifier: "249"+localStorage.getItem('username')
    };
   
    
    this.GetServicesProvider.load(dat,'gmpp/registerConsumer').then(data => {
      
      this.showAlert(data);
      if (data.responseCode==1){
      this.profile = JSON.parse(localStorage.getItem("profile"));
      this.profile.phoneNumber="249"+localStorage.getItem('username');
      this.api.put("/profiles", this.profile).subscribe((res: any) => {
        console.log(res);
        
      }, err => {
        console.log(err);
      });
      }
    });
  }

  login() {
   this.navCtrl.push('SwitchaccountPage');
   this.viewCtrl.dismiss();
  }

  dismiss() {
    this.profile = JSON.parse(localStorage.getItem("profile"));
  //  this.profile.phoneNumber=null;//"249"+localStorage.getItem('username');
    localStorage.setItem("profile",JSON.stringify(this.profile));
    this.viewCtrl.dismiss();
  }
}
