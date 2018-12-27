import { Component } from "@angular/core";
import { IonicPage, NavController, App } from "ionic-angular";
import { Api } from "../../../providers/providers";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: "page-user-settings",
  templateUrl: "user-settings.html"
})
export class UserSettingsPage {
  user: any;
  language: any;
  username: any;
  profile: any;
  languages: any[] = [
    { language: "English", Code: "en" },
    { language: "Arabic", Code: "ar" }
  ];

  constructor(
    private translate: TranslateService,
    public storage: Storage,
    public api: Api,
    public app: App,
    public navCtrl: NavController
  ) {
    this.language = this.translate.getDefaultLang();
    this.username = localStorage.getItem("username");
    this.profile = JSON.parse(localStorage.getItem("profile"));
    //console.log(this.profile)

    this.user = {
      name: "Marty Mcfly",
      imageUrl: this.api.url + "/profileimage/" + this.username
    };
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
    //this.navCtrl.setRoot('WelcomePage');
    this.app.getRootNav().setRoot("WelcomePage");
  }
}
