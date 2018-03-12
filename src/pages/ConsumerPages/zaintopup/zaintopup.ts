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
  profile:any;

  private bal : any;
  private todo : FormGroup;
  public cards:Card[]=[];
  public title:any;
  showWallet:boolean=true;
  
public payee:any[]=[
  {
    PayeeName:"Zain",
    PayeeId:"Zain Top Up"
  },
  {
    PayeeName:"MTN",
    PayeeId:"MTN Top Up"
  },
  {
    PayeeName:"Sudani",
    PayeeId:"Sudani Top Up"
  }
];
submitAttempt: boolean = false;
  constructor( private formBuilder: FormBuilder ,public loadingCtrl: LoadingController , public GetServicesProvider : GetServicesProvider,public alertCtrl: AlertController
  ,public user:UserProvider,public storage:Storage,public modalCtrl:ModalController, public navParams: NavParams) {
    this.storage.get('cards').then((val) => {
    this.cards=val;
    if(this.cards){
    if(this.cards.length <= 0){
      this.todo.controls["mobilewallet"].setValue(true);
    }}else{
      this.todo.controls["mobilewallet"].setValue(true);
    }
      });
     
this.title=this.navParams.get("name");
if(this.title==="billpayment"){
  this.payee=[
    {
      PayeeName:"Zain",
      PayeeId:"Zain Bill Payment"
    },
    {
      PayeeName:"MTN",
      PayeeId:"MTN Bill Payment"
    },
    {
      PayeeName:"Sudani",
      PayeeId:"SUDANI Bill Payment"
    }
  ];
}
    //user.printuser();

    this.todo = this.formBuilder.group({
      pan: ['',],
      mobilewallet:['',],
      Card: ['',],
      entityId:[''],
      payeeId: ['',Validators.required],
        IPIN: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(4), Validators.pattern('[0-9]*')])],
        MPHONE: ['',Validators.required],
          Amount: ['',Validators.required],

    });
this.todo.controls["mobilewallet"].setValue(false);
this.todo.controls["entityId"].setValue("249"+localStorage.getItem('username'));


  }
  WalletAvalible(){

    this.profile = JSON.parse(localStorage.getItem("profile"));
    if(!this.profile.phoneNumber){

   
      let modal=this.modalCtrl.create('SignupModalPage', {},{ cssClass: 'inset-modals' });
      modal.present();
      this.todo.reset();
 
        this.showWallet=false;
     
    
      
    }else  if(this.cards){
      if(this.cards.length <= 0){
        this.showWallet=true;
        let modal=this.modalCtrl.create('HintModalPage', {},{ cssClass: 'inset-modals' });
        modal.present();
      }}else{
        this.showWallet=true;
      
        let modal=this.modalCtrl.create('HintModalPage', {},{ cssClass: 'inset-modals' });
        modal.present();
    }
   

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
  console.log(dat.IPIN)
   dat.tranCurrency='SDG';
   dat.mbr='0';
   dat.tranAmount=dat.Amount;

if(dat.mobilewallet){
  dat.entityType="Mobile Wallet";

  dat.authenticationType='10';
  dat.pan="";
}else{
  dat.pan=dat.Card.pan;
  dat.expDate=dat.Card.expDate;
  dat.authenticationType='00';
}

   dat.fromAccountType='00';
      dat.toAccountType='00';
      dat.paymentInfo="MPHONE="+dat.MPHONE;
     
  

 console.log(dat)
  this.GetServicesProvider.load(dat,'consumer/payment').then(data => {
   this.bal = data;
    console.log(data)
    if(data != null && data.responseCode==0){
     loader.dismiss();
    // this.showAlert(data);
    var dats=this.todo.value;
 var datas;
 var dat =[];
 if(data.PAN){
  dat.push({"Card":data.PAN})
}else{
  dat.push({"WalletNumber":data.entityId})
}
   if(data.balance){
         datas ={
        
       "PhoneNumber":dats.MPHONE,    
    "acqTranFee":data.acqTranFee 
    ,"issuerTranFee":data.issuerTranFee
     ,"tranAmount":data.tranAmount
     ,"tranCurrency":data.tranCurrency
     ,"balance":data.balance.available
  };

   }else{
        datas ={
          
          "PhoneNumber":dats.MPHONE,    
    "acqTranFee":data.acqTranFee
    ,"issuerTranFee":data.issuerTranFee
     ,"tranAmount":data.tranAmount
        ,"tranCurrency":data.tranCurrency
  };
   }

   var main =[];
    var mainData={
      [this.title]:data.tranAmount
    }
    main.push(mainData);
     if(Object.keys(data.billInfo).length>0){
    dat.push(data.billInfo);
  }

 
      dat.push(datas);
    
      let modal = this.modalCtrl.create('BranchesPage', {"data":dat,"main":main},{ cssClass: 'inset-modal' });
   modal.present();
   this.todo.reset();
    this.submitAttempt=false;
    this.todo.controls["mobilewallet"].setValue(false);
    this.todo.controls["entityId"].setValue("249"+localStorage.getItem('username'));

  }else{
   loader.dismiss();
  this.showAlert(data);
this.todo.reset();
    this.submitAttempt=false;
    this.todo.controls["mobilewallet"].setValue(false);
    this.todo.controls["entityId"].setValue("249"+localStorage.getItem('username'));

  }
 });

  }}


}
