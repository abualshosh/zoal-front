import { Component } from "@angular/core";
import { NavController, IonicPage, ModalController } from "ionic-angular";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { Api } from "../../../providers/providers";
import { Events } from "ionic-angular";

@IonicPage()
@Component({
  templateUrl: "chats.html"
})
export class ChatsPage {
  public messageForm: any;
  chats = [];
  messages: any = [];
  constructor(
    public modalCtrl: ModalController,
    public events: Events,
    public api: Api,
    public sqlite: SQLite,
    public navCtrl: NavController
  ) {
    this.chats.push({
      imageUrl: this.api.url + "/profileimage/" + "249922190200",
      title: "249922190200",
      fullname: "Awab",
      lastMessage: "s",
      timestamp: ""
    });

    this.events.subscribe("sending", msgData => {
      var found = false;
      for (var i = 0; i < this.chats.length; i++) {
        if (this.chats[i].title == msgData.username) {
          found = true;
          this.chats[i].fullname = msgData.fullname;
          this.chats[i].lastMessage = msgData.text;
        }
      }
      if (!found) {
        this.chats.push({
          imageUrl: this.api.url + "/profileimage/" + msgData.username,
          title: msgData.username,
          fullname: msgData.fullname,
          lastMessage: msgData.text,
          timestamp: msgData.date
        });
      }
    });

    this.events.subscribe("message", res => {
      var add = false;
      for (var i = 0; i < this.chats.length; i++) {
        if (this.chats[i].title == res.sender) {
          this.chats[i].fullname = res.fullname;
          this.chats[i].lastMessage = res.message;
          this.chats[i].timestamp = res.msgData;
          add = true;
        }
      }

      if (!add) {
        this.chats.push({
          imageUrl: this.api.url + "/profileimage/" + res.sender,
          title: res.sender,
          fullname: res.fullname,
          lastMessage: res.message,
          timestamp: res.msgoy
        });
      }
    });

    this.sqlite
      .create({
        name: localStorage.getItem("username"),
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("SELECT * FROM chats", []).then(
          data => {
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                this.chats.push({
                  imageUrl:
                    this.api.url +
                    "/profileimage/" +
                    data.rows.item(i).otherUser,
                  title: data.rows.item(i).otherUser,
                  fullname: data.rows.item(i).otherUserFullname,
                  lastMessage: data.rows.item(i).msg,
                  timestamp: data.rows.item(i).msgDate
                });
              }
            }
          },
          e => {
            //console.log("Errot: " + JSON.stringify(e));
          }
        );
      })
      .catch(e => console.log(e));
  }

  selectNew() {
    let profileModal = this.modalCtrl.create("SelectUserPage", null, {
      cssClass: "inset-modal-box"
    });
    profileModal.onDidDismiss(data => {
      if (data) {
        this.viewMessages({ title: data });
      }
    });
    profileModal.present();
  }

  viewMessages(chat) {
    this.messages = [];
    this.sqlite
      .create({
        name: localStorage.getItem("username"),
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql(
          "SELECT * FROM messages where chatid=? order by id DESC limit ? ",
          [chat.title, 10]
        ).then(
          data => {
            if (data.rows.length > 0) {
              for (var i = data.rows.length - 1; i >= 0; i--) {
                this.messages.push({
                  toId: data.rows.item(i).otherUser,
                  _id: 6,
                  date: data.rows.item(i).msgDate,
                  userId: data.rows.item(i).otherUser,
                  username: data.rows.item(i).otherUser,
                  fullname: data.rows.item(i).otherUserFullname,
                  pic:
                    this.api.url +
                    "/profileimage/" +
                    data.rows.item(i).otherUser,
                  text: data.rows.item(i).msg
                });
              }
            }
            this.navCtrl.push("MessagesPage", {
              otherUser: chat.title,
              otherUserFullname: chat.fullname,
              msg: this.messages
            });
          },
          e => {
            //console.log("Errot: " + JSON.stringify(e));
          }
        );
      })
      .catch(e =>
        this.navCtrl.push("MessagesPage", {
          otherUser: chat.title,
          otherUserFullname: chat.fullname,
          msg: this.messages
        })
      );
  }
}
