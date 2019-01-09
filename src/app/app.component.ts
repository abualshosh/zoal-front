import { Component, ViewChild } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { TranslateService } from "@ngx-translate/core";
import { Config, Nav, Platform, App } from "ionic-angular";
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

  user: any;
  language: any;
  username: any;
  profile: any;
  languages: any[] = [
    { language: "English", Code: "en" },
    { language: "Arabic", Code: "ar" }
  ];

  constructor(
    private imageLoaderConfig: ImageLoaderConfig,
    private translate: TranslateService,
    platform: Platform,
    public storage: Storage,
    public events: Events,
    public api: Api,
    public app: App,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen
  ) {
    if (localStorage.getItem("logdin") == "true") {
      this.rootPage = "TabsPage";
    }

    events.subscribe("isGmpp", isGmpp => {
      if (isGmpp == "gmpp") {
        this.sideMenuPages = this.gmppPages;
      } else if (isGmpp == "consumer") {
        this.sideMenuPages = this.consumerPages;
      } else {
        this.sideMenuPages = [];
      }
    });

    this.language = this.translate.getDefaultLang();
    this.username = localStorage.getItem("username");
    this.profile = JSON.parse(localStorage.getItem("profile"));

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      imageLoaderConfig.enableDebugMode();
      imageLoaderConfig.setImageReturnType("base64");
      this.statusBar.backgroundColorByHexString("#e0e0e0");
      this.statusBar.styleDefault();
      // this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.initTranslate();
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    var lang = localStorage.getItem("lang");

    if (lang !== undefined && lang !== "" && lang !== null) {
      this.translate.setDefaultLang(localStorage.getItem("lang"));
      this.translate.use(localStorage.getItem("lang"));
    } else {
      this.translate.setDefaultLang("ar");
      this.translate.use("ar"); // Set your language here
    }

    this.translate.get(["BACK_BUTTON_TEXT"]).subscribe(values => {
      this.config.set("ios", "backButtonText", values.BACK_BUTTON_TEXT);
    });
  }

  ChangeLang() {
    localStorage.setItem("lang", this.language);
    this.translate.setDefaultLang(this.language);
    this.translate.use(this.language); // Set your language here
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
    this.app.getRootNav().setRoot("WelcomePage");
  }

  openPage(page) {
    this.nav.push(page.component);
  }
}
