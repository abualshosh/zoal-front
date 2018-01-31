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
 * Generated class for the MohePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-mohe',
  templateUrl: 'mohe.html',
})
export class MohePage {


    private bal : any;
    private todo : FormGroup;
    public cards:Card[]=[];
  public payee:any[]=[];
  public isArab=false;
    public title:any;
    submitAttempt: boolean = false;
  CourseIDs: Array<{title: string, id: any}> = [
      { title: 'Academic' , id: '1' },
    { title: 'Agricultural' , id: '2' },
      { title: 'commercial' , id: '3' },
        { title: 'Industrial' , id: '4' },
          { title: 'Womanly' , id: '5' },
            { title: 'Ahlia' , id: '6' },
              { title: 'Readings' , id: '7' }
  ];
  FormKinds: Array<{title: string, id: any}> = [
      { title: 'General admission-first round' , id: '1' },
    { title: 'Specialadmission' , id: '2' },
      { title: 'Sons of higher education staff' , id: '3' },
        { title: 'General admission-second round' , id: '4' },
          { title: 'Special admission-vacant seats' , id: '5' },
            { title: 'Private institutions direct admission' , id: '6' },
              { title: 'Diploma in public institutions' , id: '7' }
  ];
  public type:any='mohe';
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
        CourseID: ['',Validators.required],
        FormKind: ['',Validators.required],
          IPIN: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(4), Validators.pattern('[0-9]*')])],
          SETNUMBER: [''],
          STUCNAME: [''],
          STUCPHONE: [''],
            Amount: ['',Validators.required],

      });

    }
ionViewWillEnter(){
  console.log("IN")
  if(this.navParams.get("name").includes("Arab")||this.navParams.get("name").includes("Foreign")){
    this.isArab=true;
  }
    console.log(this.navParams.get("name"))
}
    showAlert(balance : any ) {
     let alert = this.alertCtrl.create({
       title: 'ERROR!',
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
     dat.mbr='1';
     dat.tranAmount=dat.Amount;
     dat.toCard=dat.ToCard;
     dat.authenticationType='00';
     dat.fromAccountType='00';
     dat.toAccountType='00';
     if(this.navParams.get("name").includes("Arab")||this.navParams.get("name").includes("Foreign")){
          dat.paymentInfo="STUCNAME="+dat.STUCNAME+"/STUCPHONE="+dat.STUCPHONE+"/STUDCOURSEID="+dat.CourseID.id+"/STUDFORMKIND="+dat.FormKind.id;
        }else{
          dat.paymentInfo="SETNUMBER="+dat.SETNUMBER+"/STUDCOURSEID="+dat.CourseID.id+"/STUDFORMKIND="+dat.FormKind.id;
      }
     dat.payeeId=this.navParams.get("title");
     dat.pan=dat.Card.pan;
     dat.expDate=dat.Card.expDate;
   console.log(dat)
    this.GetServicesProvider.load(dat,'Payment').then(data => {
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
