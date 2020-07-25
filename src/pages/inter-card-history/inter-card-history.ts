import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import * as cryptoJS from 'crypto-js'


/**
 * Generated class for the InterCardHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inter-card-history',
  templateUrl: 'inter-card-history.html',
})
export class InterCardHistoryPage {
  interCards:any[] =[]
  constructor(public navCtrl: NavController, public navParams: NavParams,private api:Api) {
    this.api.get('internet-card-user').subscribe((res: any) => {
      // console.table(res);
      
      res.forEach(internetCard => {
        let decrypt = cryptoJS.AES.decrypt(internetCard.secretNumber, localStorage.getItem('IKey'));        
         
         
        internetCard.secretNumber = decrypt.toString(cryptoJS.enc.Utf8);
        
      })
      this.interCards = res
      console.log(this.interCards);
      
      
      
    })
  }

  ionViewDidLoad() {
  }

}
