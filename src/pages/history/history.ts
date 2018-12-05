import { Component ,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,Content } from 'ionic-angular';
import { Api } from '../../providers/providers'
/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  last: boolean = false;
  showSearchbar: boolean = false;
  size: any;
  page: any = 0;
  history = [];
  checkBoxes=[
    {
      "id":1,
      "name":"E15",
      "value":false
    }
    ,
    {
      "id":2,
      "name":"E152",
      "value":false
    } ,
    {
      "id":2,
      "name":"E152",
      "value":false
    } ,
    {
      "id":2,
      "name":"E152",
      "value":false
    }
  ];
  @ViewChild('content') content: Content;
  constructor(public navCtrl: NavController,public modalCtrl:ModalController, public navParams: NavParams, public api: Api) {
    this.api.get('historiesmobile', "?page=0&size=15", null).subscribe((res: any) => {
          this.last = res.last;
              //console.log(this.size)
              this.history = res.content;
          
          }, err => {
  console.error('ERROR', err);
      });
  }
  search(){
    this.checkBoxes.forEach(box => {
      //console.log(box.value)
    });
  }
  toggleSearch(){
    if(this.showSearchbar){
      this.showSearchbar=false;
    }else{
      this.showSearchbar=true;
    }
    
    this.content.resize();
  }
  check(){
    this.content.resize();
  }
  itemSelected(input){

  var data= input.detailes;
  
    data=JSON.parse(data.substr(data.indexOf("response    ")+12));
    var datas;
   if(data.balance){
         datas ={
          "destinationIdentifier":data.destinationIdentifier,
          "toCard":data.toCard,
          "tan":data.tan,
          "fee":data.fee
          ,"transactionAmount":data.transactionAmount
          ,"totalAmount":data.totalAmount
    ,"acqTranFee":data.acqTranFee
    ,"issuerTranFee":data.issuerTranFee
     ,"tranAmount":data.tranAmount
     ,"tranCurrency":data.tranCurrency
   //  ,"balance":data.balance.available
     ,"transactionId":data.transactionId
     ,"date":input.transactionDate
  };
      
   }else{
        datas ={
          "destinationIdentifier":data.destinationIdentifier,
          "toCard":data.toCard,
      "tan":data.tan,
      "fee":data.fee
    ,"transactionAmount":data.transactionAmount
    ,"totalAmount":data.totalAmount
    ,"acqTranFee":data.acqTranFee
    ,"issuerTranFee":data.issuerTranFee
     ,"tranAmount":data.tranAmount
        ,"tranCurrency":data.tranCurrency
        ,"transactionId":data.transactionId
        ,"date":input.transactionDate
  }; 
   }

 

   var dat =[];
   if(data.PAN){
    dat.push({"Card":data.PAN
   
  })
  }else{
   data.entityId ? dat.push({"WalletNumber":data.entityId}) : dat.push({"WalletNumber":data.consumerIdentifier})
  }


   if(data.billInfo){
   if(Object.keys(data.billInfo).length>0){
     if(data.billInfo.accountNo){
       data.billInfo.accountNo=null;
     }
     if(data.billInfo.opertorMessage){
      data.billInfo.opertorMessage=null;
    }
   
    dat.push(data.billInfo);
   }}

   var voucher={
 //   "voucherNumber":data.voucherNumber
  //  ,
    "voucherCode":data.voucherCode
}
var main =[];
var mainData={};

mainData[input.transactionType] = (data.totalAmount ? data.totalAmount : data.tranAmount); 
if(!mainData[input.transactionType]){
  mainData[input.transactionType] = data.transactionAmount;
}
main.push(mainData);
 dat.push(voucher);
      dat.push(datas);
  
      let modal = this.modalCtrl.create('BranchesPage', {"data":dat,"main":main},{ cssClass: 'inset-modal' });
   modal.present();
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;
    this.api.get('historiesmobile', "?page=" + this.page + "&size=15", null).subscribe((res: any) => {
     this.last = res.last;
        //console.log(this.size);
        for (let i = 0; i < res.content.length; i++) {
          this.history.push(res.content[i]);
        }
        infiniteScroll.complete();
   }, err => {
 console.error('ERROR', err);
    });
  }
}
