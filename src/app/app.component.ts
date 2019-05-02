import { Component, ViewChild } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { TranslateService } from "@ngx-translate/core";
import { Config, Nav, Platform, App, MenuController } from "ionic-angular";
import { Api, User } from "../providers/providers";
import { ImageLoaderConfig } from "ionic-image-loader";
import { Storage } from "@ionic/storage";
import { Events } from "ionic-angular";
import { StorageProvider } from "../providers/storage/storage";
import { HttpHeaders } from "@angular/common/http";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage = "WelcomePage";
  subscription: any;
  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    {
      title: "favoriteDetailPage",
      component: "CardWalletFavoriteDetailPage",
      icon: "heart",
      params: { type: "favorites" }
    },
    {
      title: "transactionHistoryPage",
      component: "TransactionHistoryPage",
      icon: "clock"
    },
    {
      title: "aboutUsPage",
      component: "AboutUsPage",
      icon: "custom-about"
    }
  ];

  gmppPages: any = [
    {
      title: "gmppSignupModalPage",
      component: "GmppSignupModalPage",
      icon: "person-add"
    },
    {
      title: "linkAccount",
      component: "GmppLinkAccountPage",
      icon: "link"
    },
    {
      title: "gmppWalletDetailPage",
      component: "CardWalletFavoriteDetailPage",
      icon: "custom-wallet",
      params: { type: "wallets" }
    },
    {
      title: "gmppBalancePage",
      component: "GmppBalancePage",
      icon: "calculator"
    },
    {
      title: "gmppResendTanPage",
      component: "GmppResendTanPage",
      icon: "refresh"
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
      component: "CardWalletFavoriteDetailPage",
      icon: "custom-card",
      params: { type: "cards" }
    },
    {
      title: "getBalancePage",
      component: "GetBalancePage",
      icon: "calculator"
    },
    {
      title: "changeIpinPage",
      component: "ChangeIpinPage",
      icon: "key"
    }
  ];

  sideMenuPages: any = [];

  profile: any;

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
    public userProvider: User,
    private splashScreen: SplashScreen
  ) {
    if (localStorage.getItem("logdin") == "true") {
      this.rootPage = "TabsPage";
    }

    this.subscribeToPaymentMethodChange();

    this.getProfile();
    events.subscribe("profile:updated", () => {
      this.getProfile();
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByHexString("#e0e0e0");
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initTranslate();
    });

    const headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + localStorage.getItem("id_token")
    );
    this.imageLoaderConfig.setHttpHeaders(headers);
    this.imageLoaderConfig.enableDebugMode();
    this.imageLoaderConfig.setFallbackUrl("assets/img/userPlaceholder.png");
    this.imageLoaderConfig.setImageReturnType("base64");
    this.imageLoaderConfig.setSpinnerColor("secondary");
    this.imageLoaderConfig.setSpinnerName("bubbles");
    this.imageLoaderConfig.setBackgroundSize("cover");
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

  getProfile() {
    this.userProvider.getProfile(localStorage.getItem("profileId")).subscribe(
      profile => {
        this.profile = profile;
      },
      err => {
        this.storageProvider.getProfile().subscribe(val => {
          this.profile = val;
        });
      }
    );
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

  changeLang(langchoice) {
    this.storage.set("lang", langchoice).then(lang => {
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
      this.checkDirection();
    });
  }

  logOut() {
    localStorage.clear();
    this.menuCtrl.close("sideMenu");
    this.app.getRootNav().setRoot("WelcomePage");
  }

  openPage(page) {
    this.nav.push(page.component, page.params);
  }

  openProfile() {
    this.nav.push("ProfilePage");
    this.menuCtrl.close();
  }
}
