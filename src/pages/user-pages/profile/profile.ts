import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { Api, User } from "../../../providers/providers";
import { StorageProvider } from "../../../providers/storage/storage";
import { AlertProvider } from "../../../providers/alert/alert";

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
    public alertProvider: AlertProvider,
    public api: Api
  ) {}

  ionViewWillEnter() {
    if (this.navParams.get("item")) {
      this.isPassed = true;
      this.user = this.navParams.get("item");
    } else {
      this.isPassed = false;
      this.getProfile();
    }
  }

  getProfile() {
    this.alertProvider.showLoading();
    this.userProvider.getProfile(localStorage.getItem("profileId")).subscribe(
      profile => {
        this.user = profile;
      },
      err => {
        this.alertProvider.showToast("errorMessage");
      },
      () => {
        this.alertProvider.hideLoading();
      }
    );
  }

  getProfileByLogin(login) {
    this.alertProvider.showLoading();
    this.userProvider.getProfileByLogin(login).subscribe(
      profile => {
        this.user = profile;
      },
      err => {
        this.navCtrl.pop();
        this.alertProvider.showToast("errorMessage");
      },
      () => {
        this.alertProvider.hideLoading();
      }
    );
  }

  editProfile() {
    this.navCtrl.push("ProfileEditPage", { user: this.user });
  }
}
