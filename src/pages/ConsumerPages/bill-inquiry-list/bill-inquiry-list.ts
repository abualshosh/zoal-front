import { Component } from '@angular/core';
import {  NavParams,LoadingController,IonicPage,NavController,AlertController } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { GetServicesProvider } from '../../../providers/get-services/get-services';
@IonicPage()
@Component({
  selector: 'page-bill-inquiry-list',
  templateUrl: 'bill-inquiry-list.html',
})
export class BillInquiryListPage {

  selectedItem: any;
  icons: string[];

public payee:any[]=[];
  constructor(public loadingCtrl: LoadingController,public alertCtrl: AlertController ,public navCtrl: NavController, public navParams: NavParams,private user:UserProvider,public GetServicesProvider:GetServicesProvider) {
    let loader = this.loadingCtrl.create({
     content: "Please wait..."
   });
   loader.present();

    this.GetServicesProvider.loadList({"data":"getPayeesList"},'getPayee').then(data => {
        
if(data!=null&&data.length>0){
      
      
      var i:any;
    
      for(i = 0; i < data.length; i++) {
if (data[i].PAYEENAME.includes("Custom")||data[i].PAYEENAME.includes("BILL PAYMENT")||data[i].PAYEENAME.includes("E15")){


    this.payee.push (data[i]);
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


  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
      
var page='BillInquiryPage';
     if (item.PAYEENAME.includes("E15")){
       page='GmppE15QPage';
     }else if (item.PAYEENAME.includes("Custom")){
        page='CustomesInqueryPage';
     }
   this.navCtrl.push(page, {
      title: item.PAYEEID,
      name:item.PAYEENAME
    });
      //console.log(item.PAYEEID);
  }
}
