import "rxjs/add/operator/toPromise";

import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Api } from "../api/api";
import "rxjs/add/operator/map";
import { Events, App } from "ionic-angular";
import { StompService } from "ng2-stomp-service";
import { StorageProvider } from "../storage/storage";
import { AlertProvider } from "../alert/alert";

@Injectable()
export class User {
  _user: any;
  public stompClient: any;

  constructor(
    public events: Events,
    public api: Api,
    public storage: Storage,
    public storageProvider: StorageProvider,
    public app: App,
    public alertProvider: AlertProvider,
    public stomp: StompService
  ) {}

  sendOtpLogin(accountInfo: any) {
    return this.api.post("send-otp/login", accountInfo);
  }

  sendOtpSignup(accountInfo: any) {
    return this.api.post("send-otp/signup", accountInfo);
  }

  validateOtp(accountInfo: any) {
    let seq = this.api.post("validate-otp", accountInfo).share();

    seq.subscribe(
      (res: any) => {
        if (res.id_token) {
          localStorage.setItem("id_token", res.id_token);
          localStorage.setItem("username", res.profile.login);
          localStorage.setItem("profileId", res.profile.id);
          localStorage.setItem("Gkey", res.gmppKey);
          localStorage.setItem("Ckey", res.consumerKey);
          localStorage.setItem("ipinkey", res.ipinKey);
        }
      },
      err => {
        console.error("ERROR", err);
      }
    );

    return seq;
  }

  getProfile(id) {
    return this.api.get("profiles/" + id);
  }

  getProfileByLogin(login) {
    return this.api.get("profiles-login/" + login);
  }

  updateProfile(data: any) {
    return this.api.put("profiles", data);
  }

  changeProfilePicture(data) {
    return this.api.post("mobile-profile-images", data);
  }

  logout() {
    localStorage.clear();
    this.app.getRootNav().setRoot("WelcomePage");
    this.alertProvider.hideLoading();
  }
}
