import { Component, ViewChild } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { TranslateService } from "@ngx-translate/core";
import { Config, Nav, Platform, App, MenuController } from "ionic-angular";
import { Api } from "../providers/providers";
import { ImageLoaderConfig } from "ionic-image-loader";
import { Storage } from "@ionic/storage";
import { Events } from "ionic-angular";
import { StorageProvider } from "../providers/storage/storage";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage = "WelcomePage";
  subscription: any;
  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    {
      title: "aboutUsPage",
      component: "AboutUsPage",
      icon: "custom-about"
    },
    {
      title: "contactUsPage",
      component: "ContactUsPage",
      icon: "custom-mail"
    }
  ];

  gmppPages: any = [
    {
      title: "gmppSignupModalPage",
      component: "GmppSignupModalPage",
      icon: "person-add"
    },
    {
      title: "gmppWalletDetailPage",
      component: "GmppWalletDetailPage",
      icon: "custom-wallet"
    },
    {
      title: "gmppBalancePage",
      component: "GmppBalancePage",
      icon: "calculator"
    },
    {
      title: "gmppLastTransactionsPage",
      component: "GmppLastTransactionsPage",
      icon: "clock"
    },
    {
      title: "changePin",
      component: "GmppChangePinPage",
      icon: "key"
    }
  ];

  consumerPages: any = [
    {
      title: "generateIpinPage",
      component: "GenerateIpinPage",
      icon: "construct"
    },
    {
      title: "cardDetailPage",
      component: "CardDetailPage",
      icon: "custom-card"
    },
    {
      title: "getBalancePage",
      component: "GetBalancePage",
      icon: "calculator"
    },
    {
      title: "transactionHistoryPage",
      component: "TransactionHistoryPage",
      icon: "clock"
    },
    {
      title: "changeIpinPage",
      component: "ChangeIpinPage",
      icon: "key"
    }
  ];

  sideMenuPages: any = [];

  language: any;
  profile: any;

  languages: any[] = [
    { language: "English", Code: "en" },
    { language: "Arabic", Code: "ar" }
  ];
  isRtl: boolean;

  constructor(
    private imageLoaderConfig: ImageLoaderConfig,
    private translate: TranslateService,
    public platform: Platform,
    public storage: Storage,
    public events: Events,
    public api: Api,
    public app: App,
    private config: Config,
    private statusBar: StatusBar,
    public menuCtrl: MenuController,
    public storageProvider: StorageProvider,
    private splashScreen: SplashScreen
  ) {
    if (localStorage.getItem("logdin") == "true") {
      this.rootPage = "TabsPage";
    }

    this.subscribeToPaymentMethodChange();

    this.storageProvider.getProfile().subscribe(val => {
      this.profile = val;
    });

    events.subscribe("profile:updated", () => {
      this.storageProvider.getProfile().subscribe(val => {
        this.profile = val;
      });
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByHexString("#e0e0e0");
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initTranslate();
    });

    // enable debug mode to get console logs and stuff
    imageLoaderConfig.enableDebugMode();
    // set a fallback url to use by default in case an image is not found
    imageLoaderConfig.setFallbackUrl("assets/img/userPlaceholder.png");
    imageLoaderConfig.setImageReturnType("base64");
    imageLoaderConfig.setSpinnerColor("secondary");
    imageLoaderConfig.setSpinnerName("bubbles");
  }

  initTranslate() {
    this.storage.get("lang").then(lang => {
      if (lang !== undefined && lang !== "" && lang !== null) {
        this.translate.setDefaultLang(lang);
        this.translate.use(lang);
        this.checkDirection();
      } else {
        this.storage.set("lang", "ar").then(lang => {
          this.translate.setDefaultLang(lang);
          this.translate.use(lang);
          this.checkDirection();
        });
      }
      this.language = this.translate.getDefaultLang();
    });

    this.translate.get(["BACK_BUTTON_TEXT"]).subscribe(values => {
      this.config.set("ios", "backButtonText", values.BACK_BUTTON_TEXT);
    });
  }

  subscribeToPaymentMethodChange() {
    this.events.subscribe("isGmpp", isGmpp => {
      if (isGmpp === "gmpp") {
        this.sideMenuPages = this.gmppPages;
      } else if (isGmpp === "consumer") {
        this.sideMenuPages = this.consumerPages;
      } else {
        this.sideMenuPages = [];
      }
    });
  }

  checkDirection() {
    this.storage.get("lang").then(lang => {
      if (lang === "ar" && this.platform.dir() === "ltr") {
        this.platform.setDir("rtl", true);
      } else if (lang === "en" && this.platform.dir() === "rtl") {
        this.platform.setDir("ltr", true);
      }
    });
  }

  changeLang() {
    this.storage.set("lang", this.language).then(lang => {
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
      this.checkDirection();
    });
  }

  toggleNotifications() {
    this.api.put("profiles", this.profile).subscribe(
      (res: any) => {
        localStorage.setItem("profile", JSON.stringify(this.profile));
      },
      err => {
        console.error("ERROR", err);
      }
    );
  }

  logOut() {
    localStorage.clear();
    this.storage.clear();
    this.menuCtrl.close("sideMenu");
    this.app.getRootNav().setRoot("WelcomePage");
  }

  openPage(page) {
    this.nav.push(page.component);
  }

  openProfile() {
    this.nav.push("ProfilePage");
    this.menuCtrl.close();
  }
}
