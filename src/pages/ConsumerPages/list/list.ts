import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController,IonicPage } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { GetServicesProvider } from '../../../providers/get-services/get-services';


@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];

public payee:any[]=[];
  constructor(public loadingCtrl: LoadingController ,public navCtrl: NavController, public navParams: NavParams,private user:UserProvider,public GetServicesProvider:GetServicesProvider) {


   this.payee=this.navParams.get("title");



    // If we navigated to this page, we will have an item available as a nav param
  //  this.selectedItem = navParams.get('item');
//user.username='ana';

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

}

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    var page;
    if(item.PAYEENAME.includes("Higher")){
      page='MohePage';
    }else if( item.PAYEENAME.includes("NEC")){
        page='ServicesPage';
    }else if( item.PAYEENAME.includes("E15")){
        page='E15Page';
    }else if( item.PAYEENAME.includes("Custom")){
        page='CustomesPage';
    }
    else{
      page='ZaintopupPage';
    }
   this.navCtrl.push(page, {
      title: item.PAYEEID,
      name: item.PAYEENAME
    });
      console.log(item.PAYEEID);
  }
}
