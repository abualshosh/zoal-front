import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Api } from "../../providers/providers";

/**
 * Generated class for the OtherProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-other-profile",
  templateUrl: "other-profile.html"
})
export class OtherProfilePage {
  user: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api
  ) {
    //console.log(navParams.get("item"));
    this.user = navParams.get("item");
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad OtherProfilePage');
  }
}
