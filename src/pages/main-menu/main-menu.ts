import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner";
import { QrScanProvider } from "../../providers/qr-scan/qr-scan";
import { Api } from "../../providers/api/api";
import { TranslateService } from "@ngx-translate/core";

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

  billerPages: any[] = [
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
    },
    {
      title: "sudaniBillPaymentPage",
      component: "SudaniBillPaymentPage",
      icon: "custom-mobile-bill",
      var: "sudaniBillPaymentPage"
    },
    // {
    //   title: "eInvoice",
    //   component: "EInvoicePage",
    //   icon: "custom-mobile-bill",
    //   var: ""
    // }
  ];

  gmppBillerPages: any[] = [
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

  internetServicesPages:any[] =[
    {
      title: "internetCards",
      component: "InternetCardComponent",
      icon: '',
      var: '',
    }
  ]
  eCommercePages:any[]=[]

  scanData: {};
  qrOptions: BarcodeScannerOptions;
  isGmpp: boolean = false;

  constructor(
    public api: Api,
    private barcodeScanner: BarcodeScanner,
    public navCtrl: NavController,
    public qrScanProvider: QrScanProvider,
    public navParams: NavParams,
    private translate:TranslateService
  ) {
    this.isGmpp = this.navParams.get("isGmpp");

    this.api.get("merchants").subscribe((res: any) => {
      res.map(merchant => {        
        let merchantName:string =""
        if (this.translate.currentLang.match("ar")) {
          merchantName = merchant.merchantNameArabic
        }
        else {
          merchantName= merchant.merchantName
        }
        if (merchant.status == "biller") {
          this.merchantPages.push({
            
            title: merchantName,
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
        pages = this.gmppBillerPages
      } else {
        pages = this.billerPages
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
    
    else if (list == "ECommercePage") {
      
      
    if (this.isGmpp) {
        pages = this.eCommercePages.concat(this.merchantPages)
    } else {
      pages = this.eCommercePages.concat(this.merchantPages)
    }
    
      title = "e-commerce";
      
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
    ).catch(err => {
      this.qrScanProvider.isScanning = false;
    });
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
