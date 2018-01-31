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
 * Generated class for the GmppBalancePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
 @Component({
   selector: 'page-switchaccount',
   templateUrl: 'switchaccount.html',
 })
 export class SwitchaccountPage {

  consumerIdentifier:any;
    private bal : any;
    private todo : FormGroup;
    private complate : FormGroup;
    public cards:Card[]=[];
   public compleate:any="FALSE";
   public GetServicesProvider : GetServicesProvider;
    constructor(public navCtrl: NavController, private formBuilder: FormBuilder ,public loadingCtrl: LoadingController , public GetServicesProviderg : GetServicesProvider,public alertCtrl: AlertController
    ,public user:UserProvider,public storage:Storage,public modalCtrl:ModalController) {
      this.storage.get('username').then((val) => {
      this.consumerIdentifier=val;
        });
  this.storage.get('Switchaccount').then((val) => {
if(val != null){
  this.compleate=val;
}
    });
      //user.printuser();
    //  this.compleate='TRUE';
      console.log(this.compleate);
  this.GetServicesProvider=GetServicesProviderg;
      this.todo = this.formBuilder.group({

           switchReson: ['',Validators.required],
          consumerPIN: ['',Validators.required]

      });

      this.complate = this.formBuilder.group({

  consumerOTP: ['',Validators.required],
          consumerPIN: ['',Validators.required]

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


Cancle(){
  this.storage.set('Switchaccount','FALSE');

  this.compleate='FALSE';
}


    logForm(){
  if(this.todo.valid){
      let loader = this.loadingCtrl.create({
       content: "Please wait..."
     });
     loader.present();
     var dat=this.todo.value;

      dat.UUID=uuid.v4();
     dat.consumerPIN=this.GetServicesProvider.encrypt(dat.UUID+dat.consumerPIN);
dat.consumerIdentifier=this.consumerIdentifier;

    console.log(dat.IPIN)
     dat.isConsumer='true';

    this.GetServicesProvider.loadGmpp(this.todo.value,'Switchwallet').then(data => {
     this.bal = data;
      console.log(data)
      if(data != null && data.responseCode==930){

          this.storage.set('Switchaccount','TRUE');
          this.storage.set("SwitchaccountUUID",dat.UUID);
      
       loader.dismiss();
      // this.showAlert(data);

    var datas =[
      {"tital":"Status","desc":data.responseMessage},
       {"tital":"SMS","desc":"An SMS will be sent shortly"},
           ];
       let modal = this.modalCtrl.create('ReModelPage', {"data":datas},{ cssClass: 'inset-modal' });
  //   modal.present();

this.showAlert(data);
this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }else{
     loader.dismiss();
    if(data.responseCode!=null){
    this.showAlert(data);}else{
  data.responseMessage="Connection Error";
  this.showAlert(data);
    }

    }
   });

    }}



        ComplateForm(){
      if(this.todo.valid){
          let loader = this.loadingCtrl.create({
           content: "Please wait..."
         });
         loader.present();
         var dat=this.todo.value;

          dat.UUID=uuid.v4();
         dat.consumerPIN=this.GetServicesProvider.encrypt(dat.UUID+dat.consumerPIN);
    dat.consumerIdentifier=this.consumerIdentifier;

        console.log(dat.IPIN)
         dat.isConsumer='true';

        this.GetServicesProvider.loadGmpp(this.todo.value,'GetWalletBalance').then(data => {
         this.bal = data;
          console.log(data)
          if(data != null && data.responseCode==1){

           loader.dismiss();
          // this.showAlert(data);

        var datas =[
          {"tital":"Status","desc":data.responseMessage}
                       ];
           let modal = this.modalCtrl.create('ReModelPage', {"data":datas},{ cssClass: 'inset-modal' });
         modal.present();
         this.Cancle();
        }else{
         loader.dismiss();
        if(data.responseCode!=null){
        this.showAlert(data);}else{
      data.responseMessage="Connection Error";
      this.showAlert(data);
        }

        }
       });

        }}




}
