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
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the TransfaerToCardPage page.
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-transfaer-to-card',
  templateUrl: 'transfaer-to-card.html',
})
export class TransfaerToCardPage {
  options: BarcodeScannerOptions;
  trustedVideoUrl:any;
  private bal : any;
  private todo : FormGroup;
  public cards:Card[]=[];
submitAttempt: boolean = false;

 public GetServicesProvider : GetServicesProvider;
  constructor(private barcodeScanner: BarcodeScanner,private nativePageTransitions: NativePageTransitions, 
    private domSanitizer: DomSanitizer,private navParams:NavParams,private formBuilder: FormBuilder ,public loadingCtrl: LoadingController , public GetServicesProviderg : GetServicesProvider,public alertCtrl: AlertController
  ,public user:UserProvider,public storage:Storage,public modalCtrl:ModalController) {
    this.storage.get('cards').then((val) => {
    this.cards=val;
      });
      this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/yzRW5ZPqoyo");
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
 scan() {
  this.options = {
    prompt: "Scan your barcode "
  }
  this.barcodeScanner.scan(this.options).then((barcodeData) => {

    
    if (barcodeData.text) {
     // alert(barcodeData.text);
      this.todo.controls['ToCard'].setValue(barcodeData.text);
    }
  
  }, (err) => {
    console.log("Error occured : " + err);
  });
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

   var main =[];
   var mainData={
     "TranToCard":data.tranAmount
   }
   main.push(mainData);

      var dat =[]; 
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
