import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner";
import { TranslateService } from "@ngx-translate/core";
import { Card } from "../../models/cards";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: "page-consumer-menu",
  templateUrl: "consumer-menu.html"
})
export class ConsumerMenuPage {
  telecomPages: any[] = [
    {
      title: "mobileCredit",
      component: "MobileCreditPage",
      icon: "phone-portrait",
      var: "mobileCredit"
    },
    {
      title: "mobileBillPayment",
      component: "MobileCreditPage",
      icon: "phone-landscape",
      var: "mobileBillPayment"
    }
  ];

  govermentPages: any[] = [
    {
      title: "customsServices",
      component: "CustomsPage",
      icon: "briefcase",
      var: ""
    },
    {
      title: "customsInquiryPage",
      component: "CustomsInquiryPage",
      icon: "briefcase",
      var: ""
    },
    { title: "e15Services", component: "E15Page", icon: "document", var: "" },
    {
      title: "Higher Education",
      component: "MohePage",
      icon: "school",
      var: ""
    }
  ];

  transferPages: any[] = [
    {
      title: "transferToCard",
      component: "TransferToCardPage",
      icon: "swap",
      var: ""
    },
    { title: "cardLess", component: "CardLessPage", icon: "print", var: "" }
  ];

  public cards: Card[] = [];
  profile: any;

  scanData: {};
  qrPrompt: string;
  qrOptions: BarcodeScannerOptions;

  constructor(
    public storage: Storage,
    private barcodeScanner: BarcodeScanner,
    public translateService: TranslateService,
    public navCtrl: NavController
  ) {
    this.profile = JSON.parse(localStorage.getItem("profile"));

    this.storage.get("cards").then(val => {
      this.cards = val;
    });

    this.translateService.get("qrCode").subscribe(value => {
      this.qrPrompt = value;
    });
  }

  openPagesList(list) {
    let listout;
    let title;
    if (list == "telecomPages") {
      listout = this.telecomPages;
      title = "telecomServices";
    } else if (list == "govermentPages") {
      listout = this.govermentPages;
      title = "govermentServices";
    } else if (list == "transferPages") {
      listout = this.transferPages;
      title = "transferServices";
    }
    this.navCtrl.push("LoadPagesPage", {
      pages: listout,
      title: title
    });
  }

  scanQr() {
    this.qrOptions = {
      prompt: this.qrPrompt
    };
    this.barcodeScanner.scan(this.qrOptions).then(
      barcodeData => {
        //alert(barcodeData.text);
        if (barcodeData.text) {
          this.navCtrl.push("TransferToCardPage", {
            pan: barcodeData.text
          });
        }
        this.scanData = barcodeData;
      },
      err => {
        console.log("Error occured : " + err);
      }
    );
  }

  openPage(page, param) {
    if (param) {
      this.navCtrl.push(page, {
        param: param
      });
    } else {
      this.navCtrl.push(page);
    }
  }
}
