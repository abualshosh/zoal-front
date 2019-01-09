import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: "page-gmpp-menu",
  templateUrl: "gmpp-menu.html"
})
export class GmppMenuPage {
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
    },
    {
      title: "GmppWalletDetailPage",
      component: "GmppWalletDetailPage",
      icon: "",
      var: ""
    }
  ];

  govermentPages: any[] = [
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
      title: "gmppTranToWallet",
      component: "GmppTranToWalletPage",
      icon: "person",
      var: ""
    },
    {
      title: "gmppTranToCard",
      component: "GmppTranToCardPage",
      icon: "person",
      var: ""
    },
    {
      title: "gmppTranFromCardPage",
      component: "GmppTranFromCardPage",
      icon: "person",
      var: ""
    },
    {
      title: "gmppPurchasePage",
      component: "GmppPurchasePage",
      icon: "person",
      var: ""
    },
    { title: "cashOut", component: "GmppCashOutPage", icon: "cash", var: "" },
    {
      title: "changePin",
      component: "GmppChangePinPage",
      icon: "construct",
      var: ""
    },
    {
      title: "linkAccount",
      component: "GmppLinkAccountPage",
      icon: "link",
      var: ""
    },
    {
      title: "lockAccount",
      component: "GmppSelfLockPage",
      icon: "lock",
      var: ""
    },
    {
      title: "unlockAccount",
      component: "GmppSelfUnlockPage",
      icon: "unlock",
      var: ""
    },
    {
      title: "gmppLastTransactionsPage",
      component: "GmppLastTransactionsPage",
      icon: "clock",
      var: ""
    },
    {
      title: "gmppBalancePage",
      component: "GmppBalancePage",
      icon: "clock",
      var: ""
    },
    {
      title: "gmppResendTanPage",
      component: "GmppResendTanPage",
      icon: "clock",
      var: ""
    },
    {
      title: "gmppRetireAccountPage",
      component: "GmppRetireAccountPage",
      icon: "clock",
      var: ""
    },
    {
      title: "gmppSignupModalPage",
      component: "GmppSignupModalPage",
      icon: "clock",
      var: ""
    }
  ];

  profile: any;

  scanData: {};
  qrPrompt: string;
  qrOptions: BarcodeScannerOptions;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    private barcodeScanner: BarcodeScanner,
    public translateService: TranslateService
  ) {
    this.profile = JSON.parse(localStorage.getItem("profile"));

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
      title: title,
      isGmpp: true
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
          this.navCtrl.push("GmppTranToWalletPage", {
            wallet: barcodeData.text
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
        isGmpp: param
      });
    } else {
      this.navCtrl.push(page);
    }
  }
}
