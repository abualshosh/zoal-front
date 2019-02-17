import "rxjs/add/operator/toPromise";

import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Api } from "../api/api";
import { Card } from "../../models/cards";
import "rxjs/add/operator/map";
import { Events, AlertController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
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
          //  this._loggedIn(res);
          //console.log(res)
          localStorage.setItem("id_token", res.id_token);
          localStorage.setItem("username", accountInfo.username);
          // localStorage.setItem("profile", JSON.stringify(res.profile));
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

    // seq.subscribe(
    //   (res: any) => {},
    //   err => {
    //     console.error("ERROR", err);
    //   }
    // );

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post("users", accountInfo).share();

    seq.subscribe(
      (res: any) => {
        // If the API returned a successful response, mark the user as logged in
        if (res.status == "201") {
          this._loggedIn(res);
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

  updateProfilePic(data) {
    return this.api.put("profiles-pic", data);
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
@Injectable()
export class UserProvider {
  cards: Card[] = [];
  username: string;
  module: string;
  isLogedin: boolean;
  userType: string;
  HAS_LOGGED_IN = "hasLoggedIn";
  HAS_SEEN_TUTORIAL = "hasSeenTutorial";

  constructor(
    public storage: Storage,
    public events: Events,
    public translates: TranslateService,
    public alertCtrl: AlertController
  ) {}

  login(username: string): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish("user:login");
  }

  signup(username: string): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish("user:signup");
  }

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove("username");
    this.events.publish("user:logout");
  }

  changeLang() {
    var valu = "";
    return this.storage.get("lang").then(langval => {
      if (langval != null) {
        valu = langval;
      } else {
        valu = "ar";
      }
      let alert = this.alertCtrl.create();
      alert.setTitle("Select a Languge?");

      alert.addInput({
        type: "radio",
        label: "العربيه",
        value: "ar",
        checked: valu == "ar"
      });

      alert.addInput({
        type: "radio",
        label: "English",
        value: "en",
        checked: valu == "en"
      });

      alert.addButton("Cancel");
      alert.addButton({
        text: "Okay",
        handler: data => {
          this.translates.use(data);
          this.storage.set("lang", data);
        }
      });
      alert.present();
    });
  }

  setUsername(username: string): void {
    this.storage.set("username", username);
  }

  getUsername(): Promise<string> {
    return this.storage.get("username").then(value => {
      return value;
    });
  }

  getuserType(): Promise<string> {
    return this.storage.get("userType").then(value => {
      return value;
    });
  }

  getmodule(): Promise<string> {
    return this.storage.get("module").then(value => {
      return value;
    });
  }
}
