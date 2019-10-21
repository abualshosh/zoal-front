import { Component, ViewChild, NgZone } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  IonicPage,
  NavController,
  Events,
  MenuController
} from "ionic-angular";
import { Api, User } from "../../providers/providers";
import { Tab2Root } from "../pages";
import { SQLite } from "@ionic-native/sqlite";
import { Platform } from "ionic-angular";
import { StorageProvider } from "../../providers/storage/storage";
import { AlertProvider } from "../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-tabs",
  templateUrl: "tabs.html"
})
export class TabsPage {
  tab1Root: any = "FeedsPage";
  tab2Root: any = Tab2Root;
  tab3Root: any = "ProfilePage";
  tab4Root: any = "ConversationsPage";
  tab5Root: any = "PaymentMethodPage";

  tab1Title: any;
  tab2Title: any;
  tab3Title: any;
  tab4Title: any;
  tab5Title: any;

  tab4BadgeCount = 0;
  subscription: any;
  profile: any;

  constructor(
    public zone: NgZone,
    public platform: Platform,
    public sqlite: SQLite,
    public api: Api,
    public events: Events,
    public navCtrl: NavController,
    public translateService: TranslateService,
    public storageProvider: StorageProvider,
    protected userProvider: User,
    protected alertProvider: AlertProvider,
    public menuCtrl: MenuController
  ) {
    translateService
      .get(["feeds", "contacts", "profile", "chat", "Pay"])
      .subscribe(values => {
        this.tab1Title = values["feeds"];
        this.tab2Title = values["contacts"];
        this.tab3Title = values["profile"];
        this.tab4Title = values["chat"];
        this.tab5Title = values["Pay"];
      });

    this.menuCtrl.enable(true, "sideMenu");

    this.getProfile();
    this.events.publish("profile:updated", "");

    this.events.subscribe("profile:updated", () => {
      this.getProfile();
    });
  }

  getProfile() {
    this.userProvider.getProfile(localStorage.getItem("profileId")).subscribe(
      profile => {
        this.profile = profile;
      },
      err => {}
    );
  }

  @ViewChild("myTabs") tabRef: any;

  selectTab() {
    this.tabRef.select(2);
  }

  openCommingSoon() {
    this.alertProvider.showToast("commingSoonTitleMessage");
  }
}
