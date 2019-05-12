import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class QrScanProvider {
  public isScanning: boolean;

  constructor(public http: HttpClient) {}
}
