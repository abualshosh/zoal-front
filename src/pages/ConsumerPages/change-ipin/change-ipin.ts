
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
 * Generated class for the CardLessPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
   selector: 'page-change-ipin',
   templateUrl: 'change-ipin.html',
 })
 export class ChangeIpinPage {


  private bal : any;
  private todo : FormGroup;
  public cards:Card[]=[];
submitAttempt: boolean = false;
 public GetServicesProvider : GetServicesProvider;
  constructor( private formBuilder: FormBuilder ,public loadingCtrl: LoadingController , public GetServicesProviderg : GetServicesProvider,public alertCtrl: AlertController
  ,public user:UserProvider,public storage:Storage,public modalCtrl:ModalController,public navCtrl: NavController) {
    this.storage.get('cards').then((val) => {
    this.cards=val;
      });

    //user.printuser();
this.GetServicesProvider=GetServicesProviderg;
    this.todo = this.formBuilder.group({

      Card: ['',Validators.required],
        IPIN: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(4), Validators.pattern('[0-9]*')])],
        newIPIN: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(4), Validators.pattern('[0-9]*')])],
          ConnewIPIN: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(4), Validators.pattern('[0-9]*')])],

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
   //console.log(dat.IPIN)
    //console.log(dat.newIPIN)
   if(dat.ConnewIPIN==dat.newIPIN){
    dat.UUID=uuid.v4();
   dat.IPIN=this.GetServicesProvider.encrypt(dat.UUID+dat.IPIN);
    dat.newIPIN=this.GetServicesProvider.encrypt(dat.UUID+dat.newIPIN);
  //console.log(dat.IPIN)

    

   dat.authenticationType='00';
   dat.pan=dat.Card.pan;
   dat.expDate=dat.Card.expDate;
 //console.log(dat)
 dat.ConnewIPIN="";
  this.GetServicesProvider.load(this.todo.value,'consumer/ChangeIPIN').then(data => {
   this.bal = data;
    //console.log(data)
    if(data != null && data.responseCode==0){
     loader.dismiss();
    // this.showAlert(data);

    var datas =[
      {"tital":"Status","desc":data.responseMessage}
     ];
       let modal = this.modalCtrl.create('ReModelPage', {"data":datas},{ cssClass: 'inset-modals' });
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
 
}else{
     loader.dismiss();
  var data={responseMessage:"IPIN Missmatch"};
  //data.responseMessage="IPIN Missmatch";
  this.showAlert(data);
}
  }}

}
