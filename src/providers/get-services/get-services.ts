import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { HttpClient, HttpParams } from "@angular/common/http";
import "rxjs/add/operator/map";
import { AlertController } from "ionic-angular";
import * as NodeRSA from "node-rsa";
import { Storage } from "@ionic/storage";
import { Api } from "../api/api";
import * as JSEncrypt from "jsencrypt";

/*
  Generated class for the GetServicesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GetServicesProvider {
  public data: any;
  public module: string = "";
  public dataListCon: any;
  public dataListGMPP: any;
  public URL: string = "http://localhost:8080/api";
  constructor(
    public api: Api,
    public http: HttpClient,
    public alertCtrl: AlertController,
    public storage: Storage
  ) {
    //console.log('Hello GetServicesProvider Provider');
    this.storage.get("module").then(val => {
      if (val != null) {
        this.module = val;
      }
    });
  }

  setModule(module: string) {
    this.module = module;
  }

  showAlert(balance: any) {
    let alert = this.alertCtrl.create({
      title: "Balance!",
      message: "Your Balance is!" + balance.balance.available,

      buttons: ["OK"],
      cssClass: "alertCustomCss"
    });
    alert.present();
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

  load(postparams: any, path: string): Promise<any> {
    return new Promise(resolve => {
      let seq = this.api.post(path, postparams).share();

      seq.subscribe(
        (res: any) => {
          resolve(res);
        },
        err => {
          resolve(err);
        }
      );
    });
  }

  loadList(postparams: any, path: string): Promise<any> {
    return Promise.resolve(this.dataListCon);
  }

  loadGmppList(postparams: any, path: string): Promise<any> {
    return Promise.resolve(this.dataListGMPP);
  }

  loadGmpp(postparams: any, path: string): Promise<any> {
    return Promise.resolve(this.data);
  }

  loadCommen(postparams: any, path: string): Promise<any> {
    return Promise.resolve(this.data);
  }
}
