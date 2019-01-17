import { Component, ViewChild } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { TranslateService } from "@ngx-translate/core";
import { Config, Nav, Platform, App, MenuController } from "ionic-angular";
import { Api } from "../providers/providers";
import { ImageLoaderConfig } from "ionic-image-loader";
import { Storage } from "@ionic/storage";
import { Events } from "ionic-angular";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage = "WelcomePage";
  subscription: any;
  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    {
      title: "profileCreatePage",
      component: "ProfileCreatePage",
      icon: "person"
    },
    {
      title: "aboutUsPage",
      component: "AboutUsPage",
      icon: "information-circle"
    },
    {
      title: "contactUsPage",
      component: "ContactUsPage",
      icon: "mail"
    }
  ];

  gmppPages: any = [
    {
      title: "gmppSignupModalPage",
      component: "GmppSignupModalPage",
      icon: "person-add"
    },
    {
      title: "GmppWalletDetailPage",
      component: "GmppWalletDetailPage",
      icon: "card"
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
      icon: "construct"
    },
    {
      title: "linkAccount",
      component: "GmppLinkAccountPage",
      icon: "link"
    },
    {
      title: "lockAccount",
      component: "GmppSelfLockPage",
      icon: "lock"
    },
    {
      title: "unlockAccount",
      component: "GmppSelfUnlockPage",
      icon: "unlock"
    },
    {
      title: "gmppRetireAccountPage",
      component: "GmppRetireAccountPage",
      icon: "trash"
    },
    {
      title: "gmppResendTanPage",
      component: "GmppResendTanPage",
      icon: "refresh"
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
      icon: "card"
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
      icon: "construct"
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
    private splashScreen: SplashScreen
  ) {
    if (localStorage.getItem("logdin") == "true") {
      this.rootPage = "TabsPage";
    }

    this.subscribeToPaymentMethodChange();

    this.language = this.translate.getDefaultLang();

    this.events.subscribe("profile", profile => {
      this.profile = profile;
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      imageLoaderConfig.enableDebugMode();
      imageLoaderConfig.setImageReturnType("base64");
      this.statusBar.backgroundColorByHexString("#e0e0e0");
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initTranslate();
    });
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
      this.translate.setDefaultLang(this.language);
      this.translate.use(this.language);
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
}
