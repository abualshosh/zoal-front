import { Component } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController,ModalController,IonicPage } from 'ionic-angular';
import { GetServicesProvider } from '../../../providers/get-services/get-services';
import { AlertController } from 'ionic-angular';
import * as NodeRSA from 'node-rsa';
import * as uuid from 'uuid';
import { UserProvider } from '../../../providers/user/user';
import {Storage} from '@ionic/storage';
import {Card} from '../../../models/cards';
import * as moment from 'moment';

@IonicPage()
@Component({
         selector: 'page-forms',
  template: `
  <ion-header>
    <ion-navbar color="bar">
      <button ion-button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-title>{{'BalInq' | translate}}</ion-title>
    </ion-navbar>
  </ion-header>


  <ion-content no-padding class="masters">
  <div class="con">


    <form [formGroup]="todo" (ngSubmit)="logForm()">
    <ion-list>
    <div *ngIf="!todo.controls.Card.valid && submitAttempt">
            <p>{{'validcardError'| translate}}</p>
              </div>
    <ion-item>
          <ion-label stacked>{{'Card' | translate}}</ion-label>
          <ion-select style="padding-left:5%;" no-padding interface="action-sheet" formControlName="Card" interface="popover" >
            <ion-option  *ngFor="let Card of cards"  [value]="Card">{{Card.pan}}</ion-option>

          </ion-select>
        </ion-item>


        <div *ngIf="!todo.controls.IPIN.valid && submitAttempt">
                        <p>{{'validipinError'| translate}}</p>
                  </div>
    <ion-item>
    <ion-label stacked> {{'IPIN'|translate}}</ion-label>
    <ion-input  class="mask-text"  type="number" formControlName="IPIN"></ion-input>
    </ion-item>

</ion-list>


<button  class="subbutn"  ion-button  type="submit" color="secondary">{{'Submit'|translate}}</button>
    </form>
</div>
    </ion-content>

  `
})

export class FormsPage {
  private bal : any;
  private todo : FormGroup;
public cards:Card[]=[];
submitAttempt: boolean = false;
 public GetServicesProvider : GetServicesProvider;
  constructor( private formBuilder: FormBuilder ,public loadingCtrl: LoadingController , public GetServicesProviderg : GetServicesProvider,public alertCtrl: AlertController
  ,public user:UserProvider,public storage:Storage,public modalCtrl: ModalController) {

    this.storage.get('cards').then((val) => {
    this.cards=val;
      });

  //  user.printuser();
this.GetServicesProvider=GetServicesProviderg;
    this.todo = this.formBuilder.group({

      Card: ['',Validators.required],
      IPIN: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(4), Validators.pattern('[0-9]*')])],

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

encrypt(msg : any){
// //var ursa: any;
// //var key=ursa.createPublicKeyFromComponents('9E07C2D85FA9788AD3D0204A19E72EA02A3324F955457486F49D1BEC92331F9AE78522E444AD9263BC88E7551BD0E55AFE7978B068A1D8D27DDD1747137B6A7D','010001');
// //return  key.encrypt(msg, 'utf8', 'base64');
// //var uuidV4=new uuidV4();
//
// var key = new NodeRSA();
//
// // key.importKey({
// //     n: new Buffer('9E07C2D85FA9788AD3D0204A19E72EA02A3324F955457486F49D1BEC92331F9AE78522E444AD9263BC88E7551BD0E55AFE7978B068A1D8D27DDD1747137B6A7D', 'hex'),
// //     e: 65537,
// //     d:null,
// //     p: null,
// //     q: null,
// //     dmp1: null,
// //     dmq1: null,
// //     coeff: null
// // }, 'components-public');
// //var publicComponents = key.exportKey('components-public');
// //console.log(publicComponents);
// return key.encrypt(msg, 'base64');
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
    
   dat.authenticationType='00';
   dat.fromAccountType='00';
   dat.pan=dat.Card.pan;
   dat.expDate=dat.Card.expDate;
 console.log(dat)
  this.GetServicesProvider.load(dat,'consumer/getBalance').then(data => {
   this.bal = data;
    console.log(data)
    if(data != null && data.responseCode==0){
     loader.dismiss();
    // this.showAlert(data);
    var main =[];
    var mainData={
      "Balance":data.balance.available
    }
    main.push(mainData);
    var datas;
    var dat =[];
    var datetime= moment(data.tranDateTime, 'DDMMyyHhmmss').format("DD/MM/YYYY  hh:mm:ss");
    datas ={
     "Card":data.PAN
    ,"balance":data.balance.available
    ,date:datetime
 };
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
