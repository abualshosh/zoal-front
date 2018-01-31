import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  size: any;
  page: any = 0;
  history = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    this.api.get('histories', "?page=0&size=5", null).subscribe((res: any) => {
          this.last = res.last;
              console.log(this.size)
              this.history = res.content;
          
          }, err => {
  console.error('ERROR', err);
      });
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;
    this.api.get('histories', "?page=" + this.page + "&size=5", null).subscribe((res: any) => {
     this.last = res.last;
        console.log(this.size);
        for (let i = 0; i < res.content.length; i++) {
          this.history.push(res.content[i]);
        }
        infiniteScroll.complete();
   }, err => {
 console.error('ERROR', err);
    });
  }
}
