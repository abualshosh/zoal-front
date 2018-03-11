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
import { Api } from '../../../providers/providers';
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
    constructor(public api:Api,public navCtrl: NavController, private formBuilder: FormBuilder ,public loadingCtrl: LoadingController , public GetServicesProviderg : GetServicesProvider,public alertCtrl: AlertController
    ,public user:UserProvider,public storage:Storage,public modalCtrl:ModalController) {
 
      this.GetServicesProvider=GetServicesProviderg;
      this.todo = this.formBuilder.group({

      
        consumerPIN: ['',Validators.required]
  
    });
  
    this.complate = this.formBuilder.group({
  
  consumerOTP: ['',Validators.required]
  
    });
    }
    ionViewDidLoad(){
  this.consumerIdentifier="249"+localStorage.getItem('username');
  this.storage.set('Switchaccount','TRUE');
  this.storage.set("SwitchaccountUUID","ea906944-e074-4d90-b104-fd8985f8cddb");
this.storage.get('Switchaccount').then((val) => {
if(val != null){

this.compleate="TRUE";
}
});
  //user.printuser();
//  this.compleate='TRUE';
  console.log(this.compleate);

  
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
     dat.consumerPIN=this.GetServicesProvider.encryptGmpp(dat.UUID+dat.consumerPIN);
dat.consumerIdentifier=this.consumerIdentifier;

    console.log(dat.IPIN)
     dat.isConsumer='true';

    this.GetServicesProvider.load(this.todo.value,'gmpp/switchCustomer').then(data => {
     this.bal = data;
      console.log(data)
      if(data != null && data.responseCode==911){

          this.storage.set('Switchaccount','TRUE');
          this.storage.set("SwitchaccountUUID",dat.UUID);
      
       loader.dismiss();
      // this.showAlert(data);

//     var datas =[
//       {"tital":"Status","desc":data.responseMessage},
//        {"tital":"SMS","desc":"An SMS will be sent shortly"},
//            ];
//        let modal = this.modalCtrl.create('ReModelPage', {"data":datas},{ cssClass: 'inset-modal' });
//   //   modal.present();

// this.showAlert(data);
this.ionViewDidLoad();
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
      if(this.complate.valid){
          let loader = this.loadingCtrl.create({
           content: "Please wait..."
         });
         loader.present();
         var dat=this.complate.value;
         this.storage.get('SwitchaccountUUID').then((val) => {
          if(val != null){
              dat.originalTranUUID=val;
          }
          dat.UUID=uuid.v4();
         dat.consumerOTP=this.GetServicesProvider.encryptGmpp(dat.UUID+dat.consumerOTP);
    dat.consumerIdentifier=this.consumerIdentifier;

     

        this.GetServicesProvider.load(this.complate.value,'gmpp/completeSwitchCustomer').then(data => {
         this.bal = data;
          console.log(data)
          if(data != null && data.responseCode==906){
             let profile = JSON.parse(localStorage.getItem("profile"));
             profile.phoneNumber=this.consumerIdentifier;
            this.api.put("/profiles", profile).subscribe((res: any) => {
              console.log(res);
              localStorage.setItem("profile",JSON.stringify(profile));
              console.log(JSON.parse(localStorage.getItem("profile")));
           loader.dismiss();
          // this.showAlert(data);

        var datas =[
          {"tital":"Status","desc":data.responseMessage}
                       ];
           let modal = this.modalCtrl.create('ReModelPage', {"data":datas},{ cssClass: 'inset-modals' });
         modal.present();
         this.Cancle();
         this.navCtrl.pop();
        }, err => {
          console.log(err);
        });
        }else{
         loader.dismiss();
        if(data.responseCode!=null){
        this.showAlert(data);}else{
      data.responseMessage="Connection Error";
      this.showAlert(data);
        }

        }});
       });

        }}




}
