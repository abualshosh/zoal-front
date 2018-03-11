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
   selector: 'page-linkacconut',
   templateUrl: 'linkacconut.html',
 })
 export class LinkacconutPage {

  consumerIdentifier:any;
    private bal : any;
    private todo : FormGroup;
    private complate : FormGroup;
    public cards:Card[]=[];
   public compleate:any="FALSE";
   public GetServicesProvider : GetServicesProvider;
    constructor(public navCtrl: NavController, private formBuilder: FormBuilder ,public loadingCtrl: LoadingController , public GetServicesProviderg : GetServicesProvider,public alertCtrl: AlertController
    ,public user:UserProvider,public storage:Storage,public modalCtrl:ModalController) {
    
      //user.printuser();
    //  this.compleate='TRUE';
      console.log(this.compleate);
  this.GetServicesProvider=GetServicesProviderg;
      this.todo = this.formBuilder.group({

           primaryAccountNumber: ['',Validators.required],
          consumerPIN: ['',Validators.required]

      });

      this.complate = this.formBuilder.group({

        
  consumerOTP: ['',Validators.required]


      });

    }
    ionViewDidLoad(){
      this.consumerIdentifier="249"+localStorage.getItem('username');

    this.storage.get('LINKACCOUNT').then((val) => {
      // this.storage.set('LINKACCOUNT','TRUE');
        //      this.storage.set("LINKUUID","539e08e8-3aa2-4ad9-8529-e5d5211203b8");
          // this.storage.set("primaryAccountNumber","9222060108520070");
           if (val != null){
           this.compleate=val;
           }
        });}
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
  this.storage.set('LINKACCOUNT','FALSE');
  this.storage.set("LINKUUID",null);
this.storage.set("primaryAccountNumber",null);
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

    this.GetServicesProvider.load(this.todo.value,'gmpp/linkAccount').then(data => {
     this.bal = data;
      console.log(data)
      if(data != null && data.responseCode==930){

          this.storage.set('LINKACCOUNT','TRUE');
          this.storage.set("LINKUUID",dat.UUID);
       this.storage.set("primaryAccountNumber",dat.primaryAccountNumber);
       loader.dismiss();
      // this.showAlert(data);

     // this.ionViewDidLoad();
      this.compleate="TRUE";
//     var datas =[
//       {"tital":"Status","desc":data.responseMessage},
//        {"tital":"SMS","desc":"An SMS will be sent shortly"},
//            ];
//        let modal = this.modalCtrl.create('ReModelPage', {"data":datas},{ cssClass: 'inset-modal' });
//   //   modal.present();

// //this.showAlert(data);
// this.navCtrl.push(this.navCtrl.getActive().component);
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

           this.storage.get('LINKUUID').then((val) => {
         if(val != null){
             dat.originalTranUUID=val;
           this.storage.get('primaryAccountNumber').then((val) => {
         if(val != null){
             dat.primaryAccountNumber=val;
              
          dat.UUID=uuid.v4();
           dat.consumerPIN=this.GetServicesProvider.encryptGmpp(dat.UUID+dat.consumerPIN);
           dat.consumerOTP=this.GetServicesProvider.encryptGmpp(dat.UUID+dat.consumerOTP);
      dat.consumerIdentifier=this.consumerIdentifier;
console.log(this.complate.value)
          console.log(dat.IPIN)
        

          this.GetServicesProvider.load(this.complate.value,'gmpp/completeLinkAccount').then(data => {
           this.bal = data;
            console.log(data)
            if(data != null && data.responseCode==935){

             loader.dismiss();
            // this.showAlert(data);

          var datas =[
            {"tital":"Status","desc":data.responseMessage}
                         ];
             let modal = this.modalCtrl.create('ReModelPage', {"data":datas},{ cssClass: 'inset-modals' });
           modal.present();
           this.Cancle();
           this.navCtrl.pop();
          }else{
           loader.dismiss();
          if(data.responseCode!=null){
          this.showAlert(data);}else{
        data.responseMessage="Connection Error";
        this.showAlert(data);
          }

        }
         });  }
         });}
 });

        }}




}
