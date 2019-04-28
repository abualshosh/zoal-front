import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { Api, User } from "../../../providers/providers";
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
    public userProvider: User,
    public api: Api
  ) {
    if (this.navParams.get("item")) {
      this.isPassed = true;
      this.user = this.navParams.get("item");
    } else {
      this.isPassed = false;
      this.getProfile();
    }

    events.subscribe("profile:updated", () => {
      this.getProfile();
    });
  }

  getProfile() {
    this.userProvider.getProfile(localStorage.getItem("profileId")).subscribe(
      profile => {
        this.user = profile;
      },
      err => {
        this.storageProvider.getProfile().subscribe(val => {
          this.user = val;
        });
      }
    );
  }

  editProfile() {
    this.navCtrl.push("ProfileEditPage", { user: this.user });
  }
}
