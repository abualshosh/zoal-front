import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Storage } from "@ionic/storage";
import { Api } from "../api/api";
import * as JSEncrypt from "jsencrypt";
import { Observable } from "rxjs/Observable";
import { AlertProvider } from "../alert/alert";

@Injectable()
export class GetServicesProvider {
  public module: string = "";

  constructor(
    public api: Api,
    public storage: Storage,
    public alertProvider: AlertProvider
  ) {
    this.storage.get("module").then(val => {
      if (val != null) {
        this.module = val;
      }
    });
  }

  encrypt(msg: any) {
    var encrypt = new JSEncrypt.JSEncrypt();

    encrypt.setPublicKey(localStorage.getItem("Ckey"));

    var encrypted = encrypt.encrypt(msg);

    return encrypted;
  }

  encryptGmpp(msg: any) {
    var encrypt = new JSEncrypt.JSEncrypt();

    encrypt.setPublicKey(localStorage.getItem("Gkey"));

    var encrypted = encrypt.encrypt(msg);

    return encrypted;
  }

  encryptIpin(msg: any) {
    var encrypt = new JSEncrypt.JSEncrypt();

    encrypt.setPublicKey(localStorage.getItem("ipinkey"));

    var encrypted = encrypt.encrypt(msg);

    return encrypted;
  }

  doTransaction(body: any, path: string): Observable<any> {
    this.alertProvider.showLoading();

    let seq = this.api.post(path, body).share();
    seq.subscribe(
      res => {},
      err => this.alertProvider.hideLoading(),
      () => this.alertProvider.hideLoading()
    );

    return seq;
  }

  getWelcomeVideoUrl() {
    return this.api.get("welcome-videos");
  }
}
