import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  MenuController,
  Platform,
  LoadingController
} from "ionic-angular";
import { SQLite } from "@ionic-native/sqlite";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { GetServicesProvider } from "../../../providers/providers";

@IonicPage()
@Component({
  selector: "page-welcome",
  templateUrl: "welcome.html"
})
export class WelcomePage {
  language: any;
  languages: any[] = [
    { language: "English", Code: "en" },
    { language: "عربي", Code: "ar" }
  ];

  isVideo: boolean = false;
  trustedVideoUrl: SafeResourceUrl;

  constructor(
    private translate: TranslateService,
    public sqlite: SQLite,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private domSanitizer: DomSanitizer,
    public serviceProvider: GetServicesProvider,
    public storage: Storage
  ) {
    this.checkDirection();

    this.menuCtrl.enable(false, "sideMenu");

    this.serviceProvider.getWelcomeVideoUrl().subscribe(res => {
      // res[0].url += "?rel=0;&autoplay=1&mute=1";
      this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
        res[0].url
      );
      this.isVideo = true;
    });
  }

  ChangeLang() {
    this.storage.set("lang", this.language).then(lang => {
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
      this.checkDirection();
    });
  }

  checkDirection() {
    this.storage.get("lang").then(lang => {
      if (lang === "ar" && this.platform.dir() === "ltr") {
        this.platform.setDir("rtl", true);
      } else if (lang === "en" && this.platform.dir() === "rtl") {
        this.platform.setDir("ltr", true);
      }
      this.language = lang;
    });
  }

  login() {
    this.navCtrl.push("LoginPage");
  }

  signup() {
    this.navCtrl.push("SignupPage");
  }
}
