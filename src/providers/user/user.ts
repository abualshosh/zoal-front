import "rxjs/add/operator/toPromise";

import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Api } from "../api/api";
import "rxjs/add/operator/map";
import { Events } from "ionic-angular";
import { StompService } from "ng2-stomp-service";
import { StorageProvider } from "../storage/storage";

@Injectable()
export class User {
  _user: any;
  public stompClient: any;

  constructor(
    public events: Events,
    public api: Api,
    public storage: Storage,
    public storageProvider: StorageProvider,
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
          this.storageProvider.setProfile(res.profile);
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

  updateProfile(data: any) {
    return this.api.put("profiles", data);
  }

  changeProfilePicture(data) {
    return this.api.post("profile-images", data);
  }
}
