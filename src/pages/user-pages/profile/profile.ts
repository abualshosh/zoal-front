import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { Api } from "../../../providers/providers";
import { StorageProvider } from "../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  user: any;
  isPassed: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public storageProvider: StorageProvider,
    public api: Api
  ) {
    if (this.navParams.get("item")) {
      this.isPassed = true;
      this.user = this.navParams.get("item");
    } else {
      this.isPassed = false;
      this.storageProvider.getProfile().subscribe(val => {
        this.user = val;
      });
    }

    events.subscribe("profile:updated", () => {
      this.storageProvider.getProfile().subscribe(val => {
        this.user = val;
      });
    });
  }

  editProfile() {
    this.navCtrl.push("ProfileEditPage", { user: this.user });
  }
}
