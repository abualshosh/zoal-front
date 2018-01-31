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
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

/**
 * Generated class for the TransfaerToCardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-transfaer-to-card',
  templateUrl: 'transfaer-to-card.html',
})
export class TransfaerToCardPage {
  private bal : any;
  private todo : FormGroup;
  public cards:Card[]=[];
submitAttempt: boolean = false;
 public GetServicesProvider : GetServicesProvider;
  constructor(private nativePageTransitions: NativePageTransitions, private navParams:NavParams,private formBuilder: FormBuilder ,public loadingCtrl: LoadingController , public GetServicesProviderg : GetServicesProvider,public alertCtrl: AlertController
  ,public user:UserProvider,public storage:Storage,public modalCtrl:ModalController) {
    this.storage.get('cards').then((val) => {
    this.cards=val;
      });
this.GetServicesProvider=GetServicesProviderg;
    this.todo = this.formBuilder.group({

      Card: ['',Validators.required],
        IPIN: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(4), Validators.pattern('[0-9]*')])],
        ToCard: ['',Validators.compose([Validators.required,Validators.minLength(16), Validators.pattern('[0-9]*')])],
        Amount: ['',Validators.compose([Validators.required, Validators.pattern('[0-9]*')])]


    });
if (this.navParams.get("pan")){
  console.log(this.navParams.get("pan"));
  this.todo.controls['ToCard'].setValue(this.navParams.get("pan"));
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
 ionViewDidLoad() {
  // let options: NativeTransitionOptions = {
  //     "direction"        : "up", // 'left|right|up|down', default 'left' (which is like 'next')
  //     "duration"         :  400, // in milliseconds (ms), default 400
  //     "slowdownfactor"   :    -1, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
  //     "slidePixels"      :   -1, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
  //     "iosdelay"         :  100, // ms to wait for the iOS webview to update before animation kicks in, default 60
  //     "androiddelay"     :  150, // same as above but for Android, default 70
  //     "winphonedelay"    :  250, // same as above but for Windows Phone, default 200,
  //     "fixedPixelsTop"   :    0, // the number of pixels of your fixed header, default 0 (iOS and Android)
  //     "fixedPixelsBottom":   0  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
  //   };

  // this.nativePageTransitions.slide(options)
  //     .then( (msg) => console.log(msg) )
  //     .catch( (err) => console.log(err));
}
ionViewWillLeave() {
  // let options: NativeTransitionOptions = {
  //     "direction"        : "down", // 'left|right|up|down', default 'left' (which is like 'next')
  //     "duration"         :  400, // in milliseconds (ms), default 400
  //     "slowdownfactor"   :    -1, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
  //     "slidePixels"      :   -1, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
  //     "iosdelay"         :  100, // ms to wait for the iOS webview to update before animation kicks in, default 60
  //     "androiddelay"     :  25, // same as above but for Android, default 70
  //     "winphonedelay"    :  250, // same as above but for Windows Phone, default 200,
  //     "fixedPixelsTop"   :    0, // the number of pixels of your fixed header, default 0 (iOS and Android)
  //     "fixedPixelsBottom":   0  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
  //   };   
  //   this.nativePageTransitions.slide(options)
  //     .then( (msg) => console.log(msg) )
  //     .catch( (err) => console.log(err));
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
  // dat.IPIN=this.GetServicesProvider.encrypt(dat.UUID+dat.IPIN);
  console.log(dat.IPIN)
   dat.tranCurrency='SDG';
   dat.mbr='1';

   dat.tranAmount=dat.Amount;
   dat.toCard=dat.ToCard;
   dat.authenticationType='00';
   dat.fromAccountType='00';
      dat.toAccountType='00';
   dat.pan=dat.Card.pan;
   dat.expDate=dat.Card.expDate;
 console.log(dat)
  this.GetServicesProvider.load(this.todo.value,'consumer/doCardTransfer').then(data => {
   this.bal = data;
    console.log(data)
    if(data != null && data.responseCode==0){
     loader.dismiss();
    // this.showAlert(data);

 var datas;
   if(data.balance){
         datas ={
    "toCard":data.toCard
    ,"tranAmount":data.tranAmount
    ,"acqTranFee":data.acqTranFee
    ,"issuerTranFee":data.issuerTranFee
     ,"tranCurrency":data.tranCurrency
     ,"balance":data.balance.available
  };

   }else{
        datas ={
          "toCard":data.toCard
          ,"tranAmount":data.tranAmount
     ,"acqTranFee":data.acqTranFee
    ,"issuerTranFee":data.issuerTranFee
    
        ,"tranCurrency":data.tranCurrency
  };
   }
      var dat =[];
    
    dat.push(datas);
      let modal = this.modalCtrl.create('BranchesPage', {"data":dat},{ cssClass: 'inset-modal' });
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
