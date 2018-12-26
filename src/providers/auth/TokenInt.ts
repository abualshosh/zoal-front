import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { AuthService } from "./auth";
import { Observable } from "rxjs/Observable";
import * as JSEncrypt from "jsencrypt";
import * as uuid from "uuid";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  encrypted: any;
  constructor(public auth: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //console.log(this.auth.getToken())
    var encrypt = new JSEncrypt.JSEncrypt();

    encrypt.setPublicKey(
      "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgFGVfrY4jQSoZQWWygZ83roKXWD4YeT2x2p41dGkPixe73rT2IW04glagN2vgoZoHuOPqa5and6kAmK2ujmCHu6D1auJhE2tXP+yLkpSiYMQucDKmCsWMnW9XlC5K7OSL77TXXcfvTvyZcjObEz6LIBRzs6+FqpFbUO9SJEfh6wIDAQAB"
    );
    var uuidsec = uuid.v4();
    this.encrypted = encrypt.encrypt("qweasdzxcv" + uuidsec);
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`,
        sec: this.encrypted,
        secuuid: uuidsec
      }
    });
    //console.log(request);
    return next.handle(request);
  }
}
