import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  // public ip = "196.223.158.38:8080";
  // public ip = "196.168.98.137:8080";
  // public ip = "196.168.8.100:8080";
  public ip = "127.0.0.1:8080";
  public url: string = "http://" + this.ip + "/api";
  public wsurl: string = "http://" + this.ip + "/websocket";

  constructor(public http: HttpClient) {}

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    // if (params) {
    //   reqOpts.params = new HttpParams();
    //   for (let k in params) {
    //     reqOpts.params.set(k, params[k]);
    //   }
    // }

    if (params) {
      endpoint = endpoint + params;
    }
    return this.http.get(this.url + "/" + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + "/" + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + "/" + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + "/" + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + "/" + endpoint, body, reqOpts);
  }
}
