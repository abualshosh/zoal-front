import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { TranslateService } from "@ngx-translate/core";

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
    public navCtrl: NavController
  ) {
    this.language = this.translate.getDefaultLang();
    if (!this.language) {
      this.language = "ar";
    }
  }

  ChangeLang() {
    localStorage.setItem("lang", this.language);
    this.translate.setDefaultLang(this.language);
    this.translate.use(this.language); // Set your language here
  }

  login() {
    this.navCtrl.push("LoginPage");
  }

  signup() {
    this.navCtrl.push("SignupPage");
  }
}
