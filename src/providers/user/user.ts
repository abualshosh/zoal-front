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

  login(accountInfo: any) {
    let seq = this.api.post("authenticate", accountInfo).share();

    seq.subscribe(
      (res: any) => {
        if (res.id_token) {
          localStorage.setItem("id_token", res.id_token);
          localStorage.setItem("username", accountInfo.username);
          this.storageProvider.setProfile(res.profile);
          localStorage.setItem("Gkey", res.gmppKey);
          localStorage.setItem("Ckey", res.consumerKey);
        }
      },
      err => {
        console.error("ERROR", err);
      }
    );

    return seq;
  }

  sendOtp(accountInfo: any) {
    let seq = this.api.post("sendSms", accountInfo).share();

    return seq;
  }

  validateOtp(accountInfo: any) {
    let seq = this.api.post("validSms", accountInfo).share();

    return seq;
  }

  updateProfile(data: any) {
    return this.api.put("profiles", data);
  }

  updateProfilePic(data) {
    return this.api.put("profiles-pic", data);
  }
}
