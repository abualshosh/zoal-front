import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner";
import { QrScanProvider } from "../../providers/qr-scan/qr-scan";
import { Api } from "../../providers/api/api";

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
      icon: "custom-mobile-topup",
      var: "mobileCredit"
    },
    {
      title: "mobileBillPayment",
      component: "MobileCreditPage",
      icon: "custom-mobile-bill",
      var: "mobileBillPayment"
    }
  ];

  govermentPages: any[] = [
    {
      title: "customsServices",
      component: "CustomsPage",
      icon: "custom-customs",
      var: ""
    },
    {
      title: "e15Services",
      component: "E15Page",
      icon: "custom-customs",
      var: ""
    },
    {
      title: "Higher Education",
      component: "MohePage",
      icon: "school",
      var: ""
    }
    // {
    //   title: "eInvoice",
    //   component: "EInvoicePage",
    //   icon: "custom-mobile-bill",
    //   var: ""
    // }
  ];

  gmppGovermentPages: any[] = [
    {
      title: "e15Services",
      component: "E15Page",
      icon: "custom-customs",
      var: ""
    },
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
      icon: "custom-tocard",
      var: ""
    },
    {
      title: "cardLess",
      component: "CardLessPage",
      icon: "custom-cardless",
      var: ""
    }
  ];

  gmppTransferPages: any[] = [
    {
      title: "gmppPurchasePage",
      component: "GmppPurchasePage",
      icon: "custom-purchase",
      var: ""
    },
    {
      title: "cashOut",
      component: "GmppCashOutPage",
      icon: "custom-cashout",
      var: ""
    },
    {
      title: "gmppTranToWallet",
      component: "GmppTranToWalletPage",
      icon: "custom-towallet",
      var: ""
    },
    {
      title: "gmppTranToCard",
      component: "GmppTranToCardPage",
      icon: "custom-wallettocard",
      var: ""
    },
    {
      title: "gmppTranFromCardPage",
      component: "GmppTranFromCardPage",
      icon: "custom-wallettocard",
      var: ""
    }
  ];

  merchantPages: {
    title: string;
    component: any;
    icon: any;
    var: any;
  }[] = [];

  scanData: {};
  qrOptions: BarcodeScannerOptions;
  isGmpp: boolean = false;

  constructor(
    public api: Api,
    private barcodeScanner: BarcodeScanner,
    public navCtrl: NavController,
    public qrScanProvider: QrScanProvider,
    public navParams: NavParams
  ) {
    this.isGmpp = this.navParams.get("isGmpp");

    this.api.get("merchants").subscribe((res: any) => {
      res.map(merchant => {
        if (merchant.status == "biller") {
          this.merchantPages.push({
            title: merchant.merchantName,
            component: "SpecialPaymentPage",
            icon: "custom-mobile-bill",
            var: merchant
          });
        }
      });
    });
  }

  openPagesList(list) {
    let pages;
    let title;
    if (list == "telecomPages") {
      pages = this.telecomPages;
      title = "telecomServices";
    } else if (list == "govermentPages") {
      if (this.isGmpp) {
        pages = this.gmppGovermentPages.concat(this.merchantPages);
      } else {
        pages = this.govermentPages.concat(this.merchantPages);
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
        this.qrScanProvider.isScanning = false;
        if (barcodeData.cancelled) {
          this.qrScanProvider.isScanning = true;
        }
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
        this.qrScanProvider.isScanning = false;
      }
    );
  }

  openPage(page, title?) {
    if (this.isGmpp) {
      this.navCtrl.push(page, {
        isGmpp: true,
        title: title
      });
    } else {
      this.navCtrl.push(page, { title: title });
    }
  }
}
