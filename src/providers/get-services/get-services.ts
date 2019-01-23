import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Storage } from "@ionic/storage";
import { Api } from "../api/api";
import * as JSEncrypt from "jsencrypt";

@Injectable()
export class GetServicesProvider {
  public module: string = "";

  constructor(public api: Api, public storage: Storage) {
    //console.log('Hello GetServicesProvider Provider');
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
}
