import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { UserProvider } from "../../../../providers/user/user";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
/**
 * Generated class for the GmppPaymentListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-gmpp-payment-list",
  templateUrl: "gmpp-payment-list.html"
})
export class GmppPaymentListPage {
  selectedItem: any;
  icons: string[];

  public payee: any[] = [];
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private user: UserProvider,
    public GetServicesProvider: GetServicesProvider
  ) {
    this.payee = this.navParams.get("title");

    // If we navigated to this page, we will have an item available as a nav param
    //  this.selectedItem = navParams.get('item');
    //user.username='ana';

    // Let's populate this page with some filler content for funzies
    this.icons = [
      "flask",
      "wifi",
      "beer",
      "football",
      "basketball",
      "paper-plane",
      "american-football",
      "boat",
      "bluetooth",
      "build"
    ];
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    var page;
    var serviceName;
    if (item.PAYEENAME.includes("TOP UP")) {
      page = "GmppPaymentPage";
      serviceName = "RECHARGE";
    } else if (item.PAYEENAME.includes("BILL PAYMENT")) {
      page = "GmppPaymentPage";
      serviceName = "BILLPAYMENT";
    } else if (item.PAYEENAME.includes("MOHE")) {
      page = "GmppMohePage";
      serviceName = "RECHARGE";
    } else {
      page = "GmppPaymentPage";
      serviceName = "RECHARGE";
    }
    this.navCtrl.push(page, {
      name: item.PAYEENAME,
      title: item.PAYEEID,
      serviceName: serviceName
    });
    //console.log(item.PAYEENAME);
  }
}
