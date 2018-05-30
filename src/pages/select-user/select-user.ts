import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SelectUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-user',
  templateUrl: 'select-user.html',
})
export class SelectUserPage {
currentItems:any=[];
username:any;

  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {
this.username=localStorage.getItem('username');
    this.currentItems=JSON.parse(localStorage.getItem("connections"));
  }


  dismiss(item) {
//    let data = { 'foo': 'bar' };

  this.viewCtrl.dismiss(item.userName);



  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad SelectUserPage');
  }

}
