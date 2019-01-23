import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  MenuController,
  Platform
} from "ionic-angular";
import { SQLite } from "@ionic-native/sqlite";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage";

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
 */
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
  constructor(
    private translate: TranslateService,
    public sqlite: SQLite,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public platform: Platform,
    public storage: Storage
  ) {
    this.checkDirection();
    this.language = this.translate.getDefaultLang();
    // if (!this.language) {
    //   this.storage.set("lang", "ar").then(lang => {
    //     this.language = lang;
    //     this.translate.setDefaultLang(this.language);
    //   });
    // }

    this.menuCtrl.enable(false, "sideMenu");
  }

  ChangeLang() {
    this.storage.set("lang", this.language).then(lang => {
      this.translate.setDefaultLang(this.language);
      this.translate.use(this.language);
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
    });
  }

  login() {
    this.navCtrl.push("LoginPage");
  }

  signup() {
    this.navCtrl.push("SignupPage");
  }
}
