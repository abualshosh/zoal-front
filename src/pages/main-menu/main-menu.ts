import { Component } from "@angular/core";
import {
  NavController,
  IonicPage,
  ModalController,
  PopoverController
} from "ionic-angular";
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from "@ionic-native/barcode-scanner";
import { Storage } from "@ionic/storage";
import { Card } from "../../models/cards";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: "page-main-menu",
  templateUrl: "main-menu.html"
})
export class MainMenuPage {
  paymentPages: any[] = [
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
      title: "electricityServices",
      component: "ElectricityServicesPage",
      icon: "flash",
      var: ""
    },
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
    },
    {
      title: "specialPaymentServices",
      component: "SpecialPaymentPage",
      icon: "card",
      var: ""
    }
  ];

  consumerPages: any[] = [];

  gmppPages: any[] = [
    { title: "purchase", component: "GmppPruchasPage", icon: "cart", var: "" },
    { title: "cashOut", component: "GmppCashOutPage", icon: "cash", var: "" },
    {
      title: "changePin",
      component: "GmppChangePinPage",
      icon: "construct",
      var: ""
    },
    {
      title: "linkAccount",
      component: "LinkacconutPage",
      icon: "link",
      var: ""
    },
    { title: "lockAccount", component: "SelflockPage", icon: "lock", var: "" },
    {
      title: "unlockAccount",
      component: "SelfunlockPage",
      icon: "unlock",
      var: ""
    },
    {
      title: "transactionHistory",
      component: "TransactionHistoryPage",
      icon: "clock",
      var: ""
    }
  ];

  transferPages: any[] = [
    { title: "transfer", component: "GmppTransPage", icon: "swap", var: "" },
    {
      title: "transferToCard",
      component: "TransferToCardPage",
      icon: "person",
      var: ""
    },
    { title: "cardLess", component: "CardLessPage", icon: "print", var: "" },
    {
      title: "transferFromWalletToCard",
      component: "GmppTranToCardPage",
      icon: "swap",
      var: ""
    },
    {
      title: "transferFromCardToWallet",
      component: "GmppTranFromCardPage",
      icon: "swap",
      var: ""
    }
  ];

  public cards: Card[] = [];
  profile: any;

  scanData: {};
  qrPrompt: string;
  qrOptions: BarcodeScannerOptions;

  constructor(
    public popoverCtrl: PopoverController,
    public storage: Storage,
    public modalCtrl: ModalController,
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

  openPopover(myEvent) {
    let popover = this.popoverCtrl.create("UserSettingsPage");
    popover.present({
      ev: myEvent
    });
  }

  openPagesList(list) {
    let listout;
    let title;
    if (list == "Paymentpages") {
      listout = this.paymentPages;
      title = "paymentServices";
    } else if (list == "Gmpppages") {
      listout = this.gmppPages;
      title = "otherServices";
    } else if (list == "TransferPages") {
      listout = this.transferPages;
      title = "transactionServices";
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

  openPage(page, name) {
    if (name) {
      this.navCtrl.push(page, {
        name: name
      });
    } else {
      this.navCtrl.push(page);
    }
  }

  ngAfterViewInit() {}
}
