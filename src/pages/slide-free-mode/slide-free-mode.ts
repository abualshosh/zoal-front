import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, IonicPage ,ModalController} from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import {Storage} from '@ionic/storage';
import {Card} from '../../models/cards';

@IonicPage()
@Component({
  selector: 'page-slide-free-mode',
  templateUrl: 'slide-free-mode.html'
})
export class SlideFreeModePage {
  @ViewChild('slider') slider: Slides;
  createdCode = null;
  Paymentpages: any[] = [
    { title: 'TOPUP', component: 'ZaintopupPage' , icon:'phone-portrait' , var:"TOPUP"},
    { title: 'billpayment', component: 'ZaintopupPage' , icon:'phone-landscape' , var:"bill"},
    { title: 'NEC', component: 'ServicesPage' , icon:'flash' , var:""},
    { title: 'Custom Service', component: 'CustomesPage' , icon:'briefcase' , var:""},
    { title: 'E15', component: 'E15Page' , icon:'document' , var:""},
    { title: 'Higher Education', component: 'MohePage' , icon:'school' , var:""},
  ]
  Consumerpages: any[] = [
    { title: 'Cards', component: 'HomePage' , icon:'card' , var:""},
    { title: 'TranToCard', component: 'TransfaerToCardPage' , icon:'person' , var:""},
    { title: 'CARDLESS', component: 'CardLessPage' , icon:'print' , var:""},
    { title: 'BalInq', component: 'FormsPage' , icon:'information-circle' , var:""},
    { title: 'ChangeIPin', component: 'ChangeIpinPage' , icon:'construct' , var:""},
  ]
  Gmpppages: any[] = [
    { title: 'Transfer', component: 'GmppTransPage' , icon:'swap' , var:""},
    { title: 'Pruchas', component: 'GmppPruchasPage' , icon:'cart' , var:""},
    { title: 'CashOut', component: 'GmppCashOutPage' , icon:'cash' , var:""},
    { title: 'BalInq', component: 'GmppBalancePage' , icon:'information-circle' , var:""},
    { title: 'BankCard(ATM)', component: 'GmppBankCardPage' , icon:'card' , var:""},
    { title: 'AccountSittings', component: 'LockPage' , icon:'construct' , var:""},
  ]
  public pet: any = 'puppies';
  scanData: {};
  public cards:Card[]=[];
  profile:any;
  options: BarcodeScannerOptions;
  constructor(public storage:Storage,public modalCtrl:ModalController, private barcodeScanner: BarcodeScanner, public navCtrl: NavController) {
    this.createdCode = "12321312312312";
    this.profile = JSON.parse(localStorage.getItem("profile"));
    this.storage.get('cards').then((val) => {
     this.cards=val;
    });    // for (let i = 0; i < 20; i++) {
    //   this.slides.push(this.slides[i % 4]);
    // }
  }

  scan() {
    this.options = {
      prompt: "Scan your barcode "
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {

      //alert(barcodeData.text);
      if (barcodeData.text) {
        this.navCtrl.push('TransfaerToCardPage', {
          pan: barcodeData.text
        });
      }
      this.scanData = barcodeData;
    }, (err) => {
      console.log("Error occured : " + err);
    });
  }

  openGmppSignup(){
    let modal=this.modalCtrl.create('SignupModalPage', {},{ cssClass: 'inset-modals' });
    modal.present();
  }
  openGmpp(page,name){
    this.profile = JSON.parse(localStorage.getItem("profile"));
    console.log(this.profile)
   
  if(!this.profile.phoneNumber){
    let modal=this.modalCtrl.create('SignupModalPage', {},{ cssClass: 'inset-modals' });
    modal.present();
  }else{
    
    this.open(page,name);
  }
  }
  openConsumer(page,name){

  this.storage.get('cards').then((val) => {
   this.cards=val;
  
   
  if(!this.cards){
  
    let modal=this.modalCtrl.create('HintModalPage', {},{ cssClass: 'inset-modals' });
    modal.present();
 
 
  }else{
    if(this.cards.length <= 0){
      let modal=this.modalCtrl.create('HintModalPage', {},{ cssClass: 'inset-modals' });
      modal.present();
   
    }else{
      this.open(page,name);
    }
    
  }
});
  }
  openPayment(page,name){
    this.profile = JSON.parse(localStorage.getItem("profile"));
    this.storage.get('cards').then((val) => {
     this.cards=val;
    
   if(!this.cards && !this.profile.phoneNumber){
    let modal=this.modalCtrl.create('WalkthroughModalPage', {},{ cssClass: 'inset-modals' });
    modal.present();
  }else{
    if(this.cards){
        if(this.cards.length <= 0 && !this.profile.phoneNumber){
          let modal=this.modalCtrl.create('WalkthroughModalPage', {},{ cssClass: 'inset-modals' });
          modal.present();
        }else{
          this.open(page,name);
        }
      
      }else{
        this.open(page,name);
      }

  }
});
  }
  open(page,name) {

//this.openGmppSignup();
    if (name) {
       
      this.navCtrl.push(page, {
        name: name
      });
    } else {
    
      this.navCtrl.push(page);
    }
  }
  ngAfterViewInit() {
    //  this.slider.freeMode = true;
  }
}
