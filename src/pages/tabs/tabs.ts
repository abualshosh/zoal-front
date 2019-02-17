import { Component, ViewChild, NgZone } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  IonicPage,
  NavController,
  Events,
  MenuController
} from "ionic-angular";
import { Api } from "../../providers/providers";
import { Tab2Root } from "../pages";
import { StompService } from "ng2-stomp-service";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { FCM } from "@ionic-native/fcm";
import { Platform } from "ionic-angular";
import { StorageProvider } from "../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-tabs",
  templateUrl: "tabs.html"
})
export class TabsPage {
  username: any;

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
    private fcm: FCM,
    public sqlite: SQLite,
    public api: Api,
    public events: Events,
    public stomp: StompService,
    public navCtrl: NavController,
    public translateService: TranslateService,
    public storageProvider: StorageProvider,
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

    this.events.subscribe("chat:received", msg => {
      this.zone.run(() => {
        this.tab4BadgeCount++;
      });
    });

    this.storageProvider.getProfile().subscribe(val => {
      this.profile = val;
    });

    events.subscribe("profile:updated", () => {
      this.storageProvider.getProfile().subscribe(val => {
        this.profile = val;
      });
    });

    platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        this.initDatabase();

        this.username = localStorage.getItem("username");

        fcm.getToken().then(token => {
          if (token) {
            localStorage.setItem("FCMToken", token);
            this.connectWebSocket(localStorage.getItem("id_token"), token);
          }
        });

        fcm.onNotification().subscribe(data => {
          // if (data.wasTapped) {
          //   alert(JSON.stringify(data));
          // } else {
          //   alert("Received in foreground");
          // }
        });

        fcm.onTokenRefresh().subscribe(token => {
          if (token) {
            localStorage.setItem("FCMToken", token);
            this.connectWebSocket(localStorage.getItem("id_token"), token);
          }
        });
      } else {
        this.connectWebSocket(localStorage.getItem("id_token"), null);
      }
    });
  }

  initDatabase() {
    this.sqlite
      .create({
        name: localStorage.getItem("username"),
        location: "default"
      })
      .then((db: SQLiteObject) => {
        this.createTables(db);
      })
      .catch(e => console.log(e));
  }

  createTables(db: SQLiteObject) {
    db.executeSql(
      `CREATE TABLE IF NOT EXISTS messages(
               ID INTEGER PRIMARY KEY AUTOINCREMENT,
               chatId INTEGER,
               otherUser TEXT,
               otherUserFullname TEXT,
               msg TEXT,
               msgDate DateTime
               
          )`,
      []
    );
    db.executeSql(
      `CREATE TABLE IF NOT EXISTS chats(
               ID INTEGER PRIMARY KEY AUTOINCREMENT,
               otherUser TEXT,
               otherUserFullname TEXT,
               msg TEXT,
               msgDate DateTime
          )`,
      []
    );
  }

  connectWebSocket(token: any, FcmToken: any) {
    //configuration
    this.stomp.configure({
      host:
        this.api.wsurl +
        "/tracker?access_token=" +
        token +
        "&FcmToken=" +
        localStorage.getItem("FCMToken"),
      headers: {
        Authorization: `Bearer ${token}`,
        FcmToken: localStorage.getItem("FCMToken")
      },

      debug: true,
      queue: { init: false }
    });

    //start connection
    this.stomp.startConnect().then(() => {
      this.stomp.done("init");

      this.subscription = this.stomp.subscribe(
        "/user/queue/messages",
        this.response
      );

      //send data
      this.events.subscribe("message", res => {
        this.zone.run(() => {
          this.tab4BadgeCount++;
        });
        this.sqlite
          .create({
            name: localStorage.getItem("username"),
            location: "default"
          })
          .then((db: SQLiteObject) => {
            db.executeSql(
              `insert into messages(
                  chatId,
                  otherUser,
                  otherUserFullname,
                  msg,
                  msgDate) 
                values (?,?,?,?,?)`,
              [res.sender, res.sender, res.fullname, res.message, res.msgDate]
            );

            db.executeSql(
              `update chats set msg=? , msgDate=? where otheruser=?`,
              [res.message, res.msgDate, res.sender]
            ).then(
              data => {
                if (data.rowsAffected == 0) {
                  db.executeSql(
                    `insert into chats(
                        otherUser,
                        otherUserFullname,
                        msg,
                        msgDate) 
                    values (?,?,?,?)`,
                    [res.sender, res.fullname, res.message, res.msgDate]
                  );
                }
              },
              e => {
                //console.log("Errot: " + JSON.stringify(e));
              }
            );
          })
          .catch(e => console.log(e));
      });

      //unsubscribe
      //    this.subscription.unsubscribe();

      //disconnect
      //    this.stomp.disconnect().then(() => {
      //        //console.log( 'Connection closed' )
      //      })
    });
  }

  public response = data => {
    this.events.publish("message", data);
  };

  @ViewChild("myTabs") tabRef: any;

  selectTab() {
    this.tabRef.select(2);
  }
}
