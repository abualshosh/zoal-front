import { Component } from '@angular/core';
import { NavController, IonicPage,ModalController } from 'ionic-angular';
import { SQLite ,SQLiteObject  } from '@ionic-native/sqlite';
import { Api } from '../../providers/providers'
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'chats.html',
})


export class ChatsPage {
public messageForm: any;
  chats = [];
messages:any=[];
  constructor(public modalCtrl: ModalController,public events: Events,public api:Api,public sqlite:SQLite,public navCtrl: NavController) {

    this.events.subscribe('sending', (msgData) => {
      var found=false;
      for(var i = 0; i < this.chats.length; i++)
      {
         if(this.chats[i].title==msgData.username){
           found=true;
          this.chats[i].lastMessage=msgData.text;
         }
      }
      if(!found){
        this.chats.push({
          imageUrl: this.api.url+'/profileimage/'+msgData.username,
          title: msgData.username,
          lastMessage: msgData.text,
          timestamp: msgData.date
        });
      }
    });
    this.events.subscribe('message', (greeting) => {
    var add=false;
      for(var i = 0; i < this.chats.length; i++)
      {
         if(this.chats[i].title==greeting.sender){
          this.chats[i].lastMessage=greeting.message;
          this.chats[i].timestamp=greeting.msgData;
        add=true; 
        }
      }

      if(!add){
        this.chats.push({
          imageUrl: this.api.url+'/profileimage/'+greeting.sender,
          title: greeting.sender,
          lastMessage: greeting.message,
          timestamp: greeting.msgoy
       
        });
      }

    });



    this.sqlite.create({
      name: localStorage.getItem('username'),
      location: 'default'
    })
      .then((db: SQLiteObject) => {

    db.executeSql("SELECT * FROM chats", []).then(data => {
       // this.items = [];

        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++)
            {

            this.chats.push({
                imageUrl: this.api.url+'/profileimage/'+data.rows.item(i).otherUser,
                title: data.rows.item(i).otherUser,
                lastMessage: data.rows.item(i).msg,
                timestamp: data.rows.item(i).msgDate
              });

       //         this.items.push(data.rows.item(i));
            }
        }
    }, (e) => {


        console.log("Errot: " + JSON.stringify(e));
    });

      })
      .catch(e => console.log(e));


  }

selectNew(){
  let profileModal = this.modalCtrl.create('SelectUserPage');
   profileModal.onDidDismiss(data => {

if (data){
 
this.viewMessages({"title":data});
          }
   });
   profileModal.present();




}
  viewMessages(chat) {
    this.messages=[];
    this.sqlite.create({
      name: localStorage.getItem('username'),
      location: 'default'
    })
      .then((db: SQLiteObject) => {
    db.executeSql("SELECT * FROM messages where chatid=? order by id DESC limit ? ", [chat.title,10]).then(data => {
    if(data.rows.length > 0) {
      for(var i = data.rows.length-1; i >= 0; i--)
      {

        this.messages.push({
          toId: data.rows.item(i).otherUser,
          _id: 6,
          date: data.rows.item(i).msgDate,
          userId: data.rows.item(i).otherUser,
          username: data.rows.item(i).otherUser,
          pic: this.api.url+'/profileimage/'+data.rows.item(i).otherUser,
          text: data.rows.item(i).msg    });

      }

    }
  this.navCtrl.push('MessagesPage', { otherUser : chat.title, msg :this.messages });
    }, (e) => {


    console.log("Errot: " + JSON.stringify(e));
    });
  })
  .catch(e => console.log(e));
  }
}
