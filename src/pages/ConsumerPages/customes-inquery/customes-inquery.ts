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
 * Generated class for the ZaintopupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
   selector: 'page-customes-inquery',
   templateUrl: 'customes-inquery.html',
 })
 export class CustomesInqueryPage {


  private bal : any;
  private todo : FormGroup;
  public cards:Card[]=[];
public payee:any[]=[];
 public title:any;

submitAttempt: boolean = false;
  constructor( private formBuilder: FormBuilder ,public loadingCtrl: LoadingController , public GetServicesProvider : GetServicesProvider,public alertCtrl: AlertController
  ,public user:UserProvider,public storage:Storage,public modalCtrl:ModalController, public navParams: NavParams) {
    this.storage.get('cards').then((val) => {
    this.cards=val;
      });
this.title=this.navParams.get("name");

    //user.printuser();

    this.todo = this.formBuilder.group({
      pan: ['',],
      Card: ['',Validators.required],
      Payee: [''],
        IPIN: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(4), Validators.pattern('[0-9]*')])],
        BANKCODE: ['',Validators.required],


    });

  }

  showAlert(balance : any ) {
   let alert = this.alertCtrl.create({
     title: 'ERROR',
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
   dat.IPIN=this.GetServicesProvider.encrypt(dat.UUID+dat.IPIN);
  //console.log(dat.IPIN)
   dat.tranCurrency='SDG';
    
   dat.tranAmount=dat.Amount;
   dat.toCard=dat.ToCard;
   dat.authenticationType='00';
   dat.fromAccountType='00';
      dat.toAccountType='00';
      dat.paymentInfo="BANKCODE="+dat.BANKCODE;
      dat.payeeId=this.navParams.get("title");
   dat.pan=dat.Card.pan;
   dat.expDate=dat.Card.expDate;
 //console.log(dat)
  this.GetServicesProvider.load(dat,'Billquiry').then(data => {
   this.bal = data;
    //console.log(data)
    if(data != null && data.responseCode==0){
     loader.dismiss();
    // this.showAlert(data);

  var dat =[];
     
    dat.push(data.billInfo);
      let modal = this.modalCtrl.create('BranchesPage', {"data":dat},{ cssClass: 'inset-modal' });
   modal.present();
   this.todo.reset();
  this.submitAttempt=false;
  }else{
   loader.dismiss();
  this.showAlert(data);
  this.todo.reset();
   this.submitAttempt=false;

  }
 });

  }}


}
