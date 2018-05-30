import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormsPage} from '../forms/test';
/**
 * Generated class for the InquiryListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inquiry-list',
  templateUrl: 'inquiry-list.html',
})
export class InquiryListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad InquiryListPage');
  }
 openPage(page) {
     if(page=='FormsPage'){
         this.navCtrl.push(FormsPage);
     }else{
   this.navCtrl.push(page);}

  }
}
