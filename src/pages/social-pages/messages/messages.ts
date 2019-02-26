import { FormControl, FormBuilder } from "@angular/forms";
import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, Content, NavParams } from "ionic-angular";
import { Api, User } from "../../../providers/providers";
import { Events } from "ionic-angular";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { StompService } from "ng2-stomp-service";
import { StorageProvider } from "../../../providers/storage/storage";
@IonicPage()
@Component({
  selector: "page-messages",
  templateUrl: "messages.html"
})
export class MessagesPage {
  toUser: any;
  last: boolean = false;
  user: any;
  profile: any;
  messages: any = [];
  doneLoading = false;
  lastindex: any = 10;

  @ViewChild(Content) contents: Content;
  chatUser: string;
  public messageForm: any;
  chatBox: any;
  mySubscribedHandler: any = res => {
    //    showGreeting(greeting.body);
    //console.log(greeting);
    if (
      this.navCtrl.getActive().name == "MessagesPage" &&
      res.sender == this.toUser._id
    ) {
      //console.log(greeting);

      this.messages.push({
        toId: this.toUser._id,
        _id: 6,
        date: res.msgDate,
        userId: this.toUser._id,
        username: this.toUser.username,
        fullname: this.toUser.fullname,
        pic: this.toUser.pic,
        text: res.message
      });

      this.scrollToBottom();
    }
  };

  constructor(
    public stomp: StompService,
    public sqlite: SQLite,
    public events: Events,
    public users: User,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public storageProvider: StorageProvider,
    public api: Api,
    navParams: NavParams
  ) {
    this.storageProvider.getProfile().subscribe(val => {
      this.profile = val;
      this.user = {
        _id: localStorage.getItem("username"),
        fullname: this.profile.fullName,
        pic: this.api.url + "/profileimage/" + localStorage.getItem("username"),
        username: localStorage.getItem("username")
      };
    });

    this.chatUser = navParams.get("otherUser");
    this.messages = navParams.get("msg");

    this.toUser = {
      _id: navParams.get("otherUser"),
      pic: this.api.url + "/profileimage/" + navParams.get("otherUser"),
      username: navParams.get("otherUser"),
      fullname: navParams.get("otherUserFullname")
    };

    this.messageForm = formBuilder.group({
      message: new FormControl("")
    });
    this.chatBox = "";

    this.stomp.subscribe("/user/queue/status", this.response);
    this.events.subscribe("message", this.mySubscribedHandler);
  }
  public response = data => {};

  ionViewWillLeave() {
    this.events.unsubscribe("message", this.mySubscribedHandler);
  }

  send(message) {
    if (message && message !== "") {
      let msgDate = new Date();
      this.users.stomp.send("/app/message", {
        sender: this.user._id,
        fullname: this.toUser.fullname,
        recipient: this.toUser._id,
        message: message,
        msgDate: new Date()
      });
      const messageData = {
        toId: this.toUser._id,
        _id: 6,
        date: msgDate,
        userId: this.user._id,
        username: this.toUser.username,
        fullname: this.toUser.fullname,
        pic: this.toUser.pic,
        text: message
      };

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
           msgDate
      ) values (?,?,?,?,?)`,
            [
              this.toUser.username,
              this.toUser.username,
              this.toUser.fullname,
              message,
              msgDate
            ]
          );

          db.executeSql(
            `update chats set msg=? , msgDate=? where otheruser=?`,
            [message, msgDate, this.toUser.username]
          ).then(
            data => {
              if (data.rowsAffected == 0) {
                db.executeSql(
                  `insert into chats(
         otherUser,
         otherUserFullname,
         msg,
         msgDate
    ) values (?,?,?,?)`,
                  [this.toUser.username, this.toUser.fullname, message, msgDate]
                );
              }
            },
            e => {
              //console.log("Errot: " + JSON.stringify(e));
            }
          );
        })
        .catch(e => console.log(e));

      this.messages.push(messageData);
      this.events.publish("sending", messageData);
      this.scrollToBottom();
    }
    this.chatBox = "";
  }

  doInfinite(refresher) {
    let startindex = this.lastindex;
    this.sqlite
      .create({
        name: localStorage.getItem("username"),
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql(
          "SELECT * FROM messages where chatid=? order by id desc limit ? offset ?",
          [this.chatUser, 10, this.lastindex]
        ).then(
          data => {
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                this.messages.splice(0, 0, {
                  toId: data.rows.item(i).otherUser,
                  _id: 6,
                  date: new Date(),
                  userId: data.rows.item(i).otherUser,
                  username: data.rows.item(i).otherUser,
                  fullname: data.rows.item(i).otherUserFullname,
                  pic:
                    this.api.url +
                    "/profileimage/" +
                    data.rows.item(i).otherUser,
                  text: data.rows.item(i).msg
                });
                this.lastindex++;
              }
            }
            if (startindex == this.lastindex) {
              this.last = true;
            }
            refresher.complete();
          },
          e => {
            //console.log("Errot: " + JSON.stringify(e));
          }
        );
      })
      .catch(e => alert(JSON.stringify(e)));
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.contents) {
        this.contents.scrollToBottom();
      }
    }, 500);
  }
}
