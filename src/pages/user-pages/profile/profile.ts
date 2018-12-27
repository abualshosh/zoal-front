import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Api } from "../../../providers/providers";

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  user: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api
  ) {
    //console.log(navParams.get("item"));
    this.user = navParams.get("item");
  }

  ionViewDidLoad() {}
}
