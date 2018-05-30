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
import * as moment from 'moment';

/**
 * Generated class for the GmppBalancePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
   selector: 'page-gmpp-tran-from-card',
   templateUrl: 'gmpp-tran-from-card.html',
 })
 export class GmppTranFromCardPage {

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
    expDate: ['',Validators.required],
      ipin: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(4), Validators.pattern('[0-9]*')])],
           consumerPIN: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(4), Validators.pattern('[0-9]*')])]

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
      dat.ipin=this.GetServicesProvider.encryptGmpp(dat.UUID+dat.ipin);
dat.consumerIdentifier=this.consumerIdentifier;
    //console.log(dat.IPIN)
     dat.isConsumer='true';
 var date = new Date(dat.expDate);
 var mon=""+(date.getMonth()+1);
if(mon.length==1){
    mon="0"+mon;
}
 dat.expDate=date.getFullYear().toString().substring(2,4)+mon;
    this.GetServicesProvider.load(this.todo.value,'gmpp/transferAccountToWallet').then(data => {
     this.bal = data;
      //console.log(data)
      if(data != null && data.responseCode==1){
       loader.dismiss();
      // this.showAlert(data);
      var datetime= moment(data.tranDateTime, 'DDMMyyHhmmss').format("DD/MM/YYYY  hh:mm:ss");

     var datas ={
      "destinationIdentifier":data.destinationIdentifier,
      "fee":data.fee,
      "Extarnal Fee":data.externalFee
      ,"transactionAmount":data.transactionAmount
      ,"totalAmount":data.totalAmount
      ,"transactionId":data.transactionId
      ,date:datetime
    };
    var dat =[];
    var main =[];
    var mainData={
      "TransfareFromCardToWallet":data.totalAmount
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
  
    }}

}
