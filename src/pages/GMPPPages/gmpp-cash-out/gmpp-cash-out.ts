
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
   selector: 'page-gmpp-cash-out',
   templateUrl: 'gmpp-cash-out.html',
 })
 export class GmppCashOutPage {

  consumerIdentifier:any;
    private bal : any;
    private todo : FormGroup;
    public cards:Card[]=[];
submitAttempt: boolean = false;
   public GetServicesProvider : GetServicesProvider;
    constructor( private formBuilder: FormBuilder ,public loadingCtrl: LoadingController , public GetServicesProviderg : GetServicesProvider,public alertCtrl: AlertController
    ,public user:UserProvider,public storage:Storage,public modalCtrl:ModalController) {
      this.consumerIdentifier="249"+localStorage.getItem('username');
  this.GetServicesProvider=GetServicesProviderg;
      this.todo = this.formBuilder.group({


    transactionAmount: ['',Validators.required],
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


    logForm(){
          this.submitAttempt=true;
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

    this.GetServicesProvider.load(this.todo.value,'gmpp/doCashOutWithTan').then(data => {
     this.bal = data;
      console.log(data)
      if(data != null && data.responseCode==1){
       loader.dismiss();
      // this.showAlert(data);

      var datas ={
        "destinationIdentifier":data.destinationIdentifier,
        "tan":data.tan,
       
        "fee":data.fee
        ,"transactionAmount":data.transactionAmount
        ,"totalAmount":data.totalAmount
        ,"transactionId":data.transactionId
      };
      var dat =[];
      var main =[];
      var mainData={
        "CashOut":data.totalAmount
      }
      dat.push({"WalletNumber":data.consumerIdentifier})
      main.push(mainData);
      dat.push(datas);
        let modal = this.modalCtrl.create('BranchesPage', {"data":dat,"main":main},{ cssClass: 'inset-modal' });
    modal.present();
     this.todo.reset();
    this.submitAttempt=false;
    }else{
     loader.dismiss();
    if(data.responseCode!=null){
    this.showAlert(data);}else{
  data.responseMessage="Connection Error";
  this.showAlert(data);
    }
this.todo.reset();
    this.submitAttempt=false;
    }
   });
dat.consumerPIN=null;
    }}
}
