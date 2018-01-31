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
  selector: 'page-zaintopup',
  templateUrl: 'zaintopup.html',
})
export class ZaintopupPage {


  private bal : any;
  private todo : FormGroup;
  public cards:Card[]=[];
  public title:any;
public payee:any[]=[
  {
    PayeeName:"Zain",
    PayeeId:"0010010001"
  },
  {
    PayeeName:"MTN",
    PayeeId:"2"
  },
  {
    PayeeName:"Sudani",
    PayeeId:"3"
  }
];
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
      payeeId: [''],
        IPIN: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(4), Validators.pattern('[0-9]*')])],
        MPHONE: ['',Validators.required],
          Amount: ['',Validators.required],

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

    dat.UUID="a7b9cce1-4a07-46f1-8396-90e571c1074f";//uuid.v4();
   dat.IPIN=this.GetServicesProvider.encrypt(dat.UUID+dat.IPIN);
  console.log(dat.IPIN)
   dat.tranCurrency='SDG';
   dat.mbr='1';
   dat.tranAmount=dat.Amount;
   dat.toCard=dat.ToCard;
   dat.authenticationType='00';
   dat.fromAccountType='00';
      dat.toAccountType='00';
      dat.paymentInfo="MPHONE="+dat.MPHONE;

   dat.pan=dat.Card.pan;
   dat.expDate=dat.Card.expDate;
 console.log(dat)
  this.GetServicesProvider.load(dat,'consumer/payment').then(data => {
   this.bal = data;
    console.log(data)
    if(data != null && data.responseCode==0){
     loader.dismiss();
    // this.showAlert(data);

 var datas;
   if(data.balance){
         datas ={
    "acqTranFee":data.acqTranFee
    ,"issuerTranFee":data.issuerTranFee
     ,"tranAmount":data.tranAmount
     ,"tranCurrency":data.tranCurrency
     ,"balance":data.balance.available
  };

   }else{
        datas ={
    "acqTranFee":data.acqTranFee
    ,"issuerTranFee":data.issuerTranFee
     ,"tranAmount":data.tranAmount
        ,"tranCurrency":data.tranCurrency
  };
   }
   var dat =[];


     if(Object.keys(data.billInfo).length>0){
    dat.push(data.billInfo);}
      dat.push(datas);
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
