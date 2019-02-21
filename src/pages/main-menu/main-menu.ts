import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController
} from "ionic-angular";
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner";
import { Storage } from "@ionic/storage";
import { StorageProvider } from "../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-main-menu",
  templateUrl: "main-menu.html"
})
export class MainMenuPage {
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
    { title: "e15Services", component: "E15Page", icon: "document", var: "" },
    {
      title: "Higher Education",
      component: "MohePage",
      icon: "school",
      var: ""
    }
  ];

  gmppGovermentPages: any[] = [
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

  gmppTransferPages: any[] = [
    {
      title: "gmppPurchasePage",
      component: "GmppPurchasePage",
      icon: "pricetag",
      var: ""
    },
    { title: "cashOut", component: "GmppCashOutPage", icon: "cash", var: "" },
    {
      title: "gmppTranToWallet",
      component: "GmppTranToWalletPage",
      icon: "swap",
      var: ""
    },
    {
      title: "gmppTranToCard",
      component: "GmppTranToCardPage",
      icon: "swap",
      var: ""
    },
    {
      title: "gmppTranFromCardPage",
      component: "GmppTranFromCardPage",
      icon: "swap",
      var: ""
    }
  ];

  profile: any;

  scanData: {};
  qrOptions: BarcodeScannerOptions;
  isGmpp: boolean = false;

  constructor(
    public storage: Storage,
    private barcodeScanner: BarcodeScanner,
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public storageProvider: StorageProvider,
    public navParams: NavParams
  ) {
    this.storageProvider.getProfile().subscribe(val => {
      this.profile = val;
    });

    this.isGmpp = this.navParams.get("isGmpp");
  }

  openPagesList(list) {
    let pages;
    let title;
    if (list == "telecomPages") {
      pages = this.telecomPages;
      title = "telecomServices";
    } else if (list == "govermentPages") {
      if (this.isGmpp) {
        pages = this.gmppGovermentPages;
      } else {
        pages = this.govermentPages;
      }

      title = "govermentServices";
    } else if (list == "transferPages") {
      if (this.isGmpp) {
        pages = this.gmppTransferPages;
      } else {
        pages = this.transferPages;
      }

      title = "transferServices";
    }

    if (this.isGmpp) {
      this.navCtrl.push("LoadPagesPage", {
        pages: pages,
        title: title,
        isGmpp: true
      });
    } else {
      this.navCtrl.push("LoadPagesPage", {
        pages: pages,
        title: title
      });
    }
  }

  scanQr() {
    this.qrOptions = {
      prompt: ""
    };
    this.barcodeScanner.scan(this.qrOptions).then(
      barcodeData => {
        //alert(barcodeData.text);
        if (barcodeData.text && !this.isGmpp) {
          this.navCtrl.push("TransferToCardPage", {
            pan: barcodeData.text
          });
        } else if (barcodeData.text && this.isGmpp) {
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

  openPage(page) {
    if (this.isGmpp) {
      this.navCtrl.push(page, {
        isGmpp: true
      });
    } else {
      this.navCtrl.push(page);
    }
  }
}
