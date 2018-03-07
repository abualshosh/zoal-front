import { Component } from '@angular/core';
import { ViewController,IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BranchesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-branches',
  templateUrl: 'branches.html',
})
export class BranchesPage {
  
public items:any[]=[];
public main:any[]=[];
  constructor(public viewCtrl: ViewController ,public navCtrl: NavController, public navParams: NavParams) {
   this.items=this.navParams.get('data');
   this.main=this.navParams.get('main');
console.log(  this.items); }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BranchesPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
