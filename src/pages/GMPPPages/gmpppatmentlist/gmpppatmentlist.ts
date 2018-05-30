import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController,IonicPage,AlertController } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { GetServicesProvider } from '../../../providers/get-services/get-services';

@IonicPage()
@Component({
  selector: 'page-gmpppatmentlist',
  templateUrl: 'gmpppatmentlist.html',
})
export class GmpppatmentlistPage {
selectedItem: any;
  icons: string[];
public payeeT:any[]=[];
public payeeP:any[]=[];
public payeeR:any[]=[];
  constructor(public loadingCtrl: LoadingController ,public alertCtrl: AlertController ,public navCtrl: NavController, public navParams: NavParams,private user:UserProvider,public GetServicesProvider:GetServicesProvider) {
    let loader = this.loadingCtrl.create({
     content: "Please wait..."
   });
   loader.present();
var req={type:"A"};

  this.GetServicesProvider.loadGmppList(req,'getPayee').then(data => {
if(data!=null&&data.length>0){
      var i:any;
      //console.log(data);
      for(i = 0; i < data.length; i++) {
   
    if (data[i].TYPE=='T'){
        this.payeeT.push (data[i]);
    }else if(data[i].TYPE=='P'){
        this.payeeP.push (data[i]);
    }else{
        this.payeeR.push (data[i]);
    } 
   
  
    }
       loader.dismiss();
    }else{
       loader.dismiss();
       this.showAlert('Connection Error!');
       this.navCtrl.setRoot('MainPage');
    }

  },error=>{
loader.dismiss();
       this.showAlert('Connection Error!');
       this.navCtrl.setRoot('MainPage');
    }

  );



    // If we navigated to this page, we will have an item available as a nav param
  //  this.selectedItem = navParams.get('item');
//user.username='ana';

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

}

showAlert(msg : any ) {
 let alert = this.alertCtrl.create({
   title: 'Error!',
   message: msg,

   buttons: ['OK'],
    cssClass: 'alertCustomCss'
 });
 alert.present();
}
  itemTapped(event, payee:any[]) {
    // That's right, we're pushing to ourselves!
 
   
   this.navCtrl.push('GmppPaymentListPage', {
      title: payee
    });
      
  }
}
