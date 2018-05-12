import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';

import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { GetServicesProvider } from '../../../providers/get-services/get-services';
import { AlertController } from 'ionic-angular';
import * as NodeRSA from 'node-rsa';
import * as uuid from 'uuid';
import { UserProvider } from '../../../providers/user/user';
import {Storage} from '@ionic/storage';
import {Card} from '../../../models/cards';
/**
 * Generated class for the GmppTransPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
   selector: 'page-gmpp-change-pin',
   templateUrl: 'gmpp-change-pin.html',
 })
 export class GmppChangePinPage {

  consumerIdentifier:any;
    private bal : any;
    private todo : FormGroup;
    public cards:Card[]=[];

   public GetServicesProvider : GetServicesProvider;
    constructor( private formBuilder: FormBuilder ,public loadingCtrl: LoadingController , public GetServicesProviderg : GetServicesProvider,public alertCtrl: AlertController
    ,public user:UserProvider,public storage:Storage,public modalCtrl:ModalController,public navCtrl:NavController) {
 
        this.consumerIdentifier="249"+localStorage.getItem('username');

      //user.printuser();
  this.GetServicesProvider=GetServicesProviderg;
      this.todo = this.formBuilder.group({


    oldPIN: ['',Validators.required],
          newPIN: ['',Validators.required]
  ,connewPIN: ['',Validators.required]
      });

    }

    showAlert(balance : any ) {
     let alert = this.alertCtrl.create({
       title: 'Error!',
       message: balance.responseMessage,

       buttons: ['OK'],
        cssClass: 'alertCustomCss'
     });
     alert.present();
   }


    logForm(){
  if(this.todo.valid){
      let loader = this.loadingCtrl.create({
       content: "Please wait..."
     });
     loader.present();
     var dat=this.todo.value;
if (dat.connewPIN== dat.newPIN){
      dat.UUID=uuid.v4();
     dat.oldPIN=this.GetServicesProvider.encryptGmpp(dat.UUID+dat.oldPIN);
     dat.newPIN=this.GetServicesProvider.encryptGmpp(dat.UUID+dat.newPIN);
dat.consumerIdentifier=this.consumerIdentifier;
    console.log(dat)
     dat.isConsumer='true';

    this.GetServicesProvider.load(this.todo.value,'gmpp/changePIN').then(data => {
     this.bal = data;
      console.log(data)
      if(data != null && data.responseCode==1){
       loader.dismiss();
       var datas =[
        {"tital":"Status","desc":data.responseMessage}
       ];
         let modal = this.modalCtrl.create('ReModelPage', {"data":datas},{ cssClass: 'inset-modals' });
       modal.present();
     
    }else{
     loader.dismiss();
    if(data.responseCode!=null){
    this.showAlert(data);}else{
  data.responseMessage="Connection Error";
  this.showAlert(data);
    this.todo.reset();
  //  this.submitAttempt=false;
    }

    }
   });
  
}else{
   loader.dismiss();
   var data={"responseMessage":""};
  data.responseMessage="PIN Miss Match";
  this.showAlert(data);
}
    }}
}
