import { Component ,ViewChild,NgZone} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController,Events } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { Tab1Root } from '../pages';
import { Tab2Root } from '../pages';
import { Tab3Root } from '../pages';
import { StompService } from 'ng2-stomp-service';
import { SQLite ,SQLiteObject  } from '@ionic-native/sqlite';
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';



@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  username:any;
  tab1Root: any = 'FeedsPage';
  tab2Root: any = Tab2Root;
  tab3Root: any = 'ContentPage';
  tab4Root: any = 'ChatsPage';
    tab5Root: any = 'SlideFreeModePage';
  tab1Title = "Feeds";
  tab2Title = "Contacts";
  tab3Title = "profile";
  tab4Title = "Chat";
  tab5Title = "Pay";
  tab4BadgeCount =0;
  upcontacts:any=[];
  currentItems: any = [];
subscription:any;
  constructor(private contacts: Contacts,public zone:NgZone,public platform: Platform,private fcm: FCM,public sqlite:SQLite,public api: Api,public events: Events,public stomp: StompService,public navCtrl: NavController, public translateService: TranslateService) {
    // translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE','Chat', 'TAB5_TITLE']).subscribe(values => {
    //   this.tab1Title = values['TAB1_TITLE'];
    //   this.tab2Title = values['TAB2_TITLE'];
    //   this.tab3Title = values['TAB3_TITLE'];
    //   this.tab4Title = values['Chat'];
    //   this.tab5Title = values['TAB5_TITLE'];
    // });
  
    platform.ready().then(() => {  
    if (this.platform.is('cordova')) {
this.initDatabase();

this.username=localStorage.getItem('username');
this.uploadContacts();
    if(typeof fcm === "undefined"){
      alert("FCMPlugin is installed correctly");
    }
  fcm.getToken().then(token=>{
   if(token){
    localStorage.setItem('FCMToken',token)
    this.connectWs(localStorage.getItem('id_token'),token);
   } })
  
  fcm.onNotification().subscribe(data=>{

    if(data.wasTapped){
      alert(JSON.stringify(data));
    } else {
      this.zone.run(() => {
      this.tab4BadgeCount++;
      });
     // alert("Received in foreground");
    };
  })
  
  fcm.onTokenRefresh().subscribe(token=>{
    if(token){
      
    localStorage.setItem('FCMToken',token);
   this.connectWs(localStorage.getItem('id_token'),token);
   
  }})
}else{
 this.connectWs(localStorage.getItem('id_token'),null);
 
}
           });
  }

  initDatabase(){
    this.sqlite.create({
      name: localStorage.getItem('username'),
      location: 'default'
    })
      .then((db: SQLiteObject) => {
  
    this.createTables(db);
  
      })
      .catch(e => console.log(e));
  }
  
  createTables(db: SQLiteObject){
          db.executeSql(`CREATE TABLE IF NOT EXISTS messages(
               ID INTEGER PRIMARY KEY AUTOINCREMENT,
               chatId INTEGER,
               otherUser TEXT,
               msg TEXT,
               msgDate DateTime
               
          )`, []);
          db.executeSql(`CREATE TABLE IF NOT EXISTS chats(
               ID INTEGER PRIMARY KEY AUTOINCREMENT,
               otherUser TEXT,
               msg TEXT,
               msgDate DateTime
          )`, []);
  
          // db.executeSql(`insert into chats(
          //              otherUser ,
          //              msg ,
          //              msgDate
          //         ) values (?,?,?)`, ['user','first m','2017-11-11']);
  
      }
  



  connectWs(token:any,FcmToken:any) {

    //configuration
    this.stomp.configure({
      host:'http://'+this.api.urlip+'/websocket/tracker?access_token='+token+'&FcmToken='+localStorage.getItem('FCMToken'),
      headers:{
        Authorization: `Bearer ${token}`,
        FcmToken: localStorage.getItem('FCMToken')
      },
      
      debug:true,
      queue:{'init':false}
    });
    
    //start connection
    this.stomp.startConnect().then(() => {
      this.stomp.done('init');
      console.log('connected');

      //subscribe
      this.subscription = this.stomp.subscribe('/user/queue/messages', this.response);
      //send data
      this.events.subscribe('message', (greeting) => {
console.log(greeting)
        this.sqlite.create({
          name: localStorage.getItem('username'),
          location: 'default'
        })
          .then((db: SQLiteObject) => {
         db.executeSql(`insert into messages(
             chatId ,
             otherUser ,
             msg ,
             msgDate
        ) values (?,?,?,?)`, [greeting.sender,greeting.sender,greeting.message,greeting.msgDate]);


        db.executeSql(`update chats set msg=? , msgDate=? where otheruser=?`,
           [greeting.message,greeting.msgDate,greeting.sender]).then(data => {
          if(data.rowsAffected == 0){
            db.executeSql(`insert into chats(
              otherUser ,
              msg ,
              msgDate
         ) values (?,?,?)`, [greeting.sender,greeting.message,greeting.msgDate]);
         
          }
            }, (e) => {
        
        
            console.log("Errot: " + JSON.stringify(e));
            });

           // for(var i = 0; i < this.chats.length; i++)
           // {
           //   if(this.chats[i].title==greeting.sender){
           //     this.chats[i].lastMessage=greeting.message;
           //     this.chats[i].timestamp=new Date();
           //   }
           // }

      })
      .catch(e => console.log(e));
      });

      //unsubscribe
  //    this.subscription.unsubscribe();

      //disconnect
  //    this.stomp.disconnect().then(() => {
//        console.log( 'Connection closed' )
//      })

    });


  }

  uploadContacts(){
    var opts = {
             filter : "M",
             multiple: true,
             hasPhoneNumber:true,
             fields:  [ 'displayName', 'name' ]
           };
  
           this.contacts.find([ 'displayName', 'name' ],opts).then((contacts) => {
             for(var i=0;i<contacts.length;i++){
               let cont=contacts[i].phoneNumbers[0].value;
              contacts[i].phoneNumbers[0].value= cont.replace(/ /g,'').trim().slice(-9);
              this.upcontacts.push({"login":contacts[i].phoneNumbers[0].value});
            }
  
  
  
            let seq = this.api.post('connections',this.upcontacts).share();
        //    this.posts=this.postsTest;
             seq.subscribe((res: any) => {
               // If the API returned a successful response, mark the user as logged in
               if (res) {
                     this.currentItems=[];
                 for (var i=0;i<res.length;i++){
                   if(res[i].profileOne.userName!=this.username){
                      this.currentItems.push(res[i].profileOne);
                   }else if(res[i].profileTow.userName!=this.username){
                     this.currentItems.push(res[i].profileTow);
                   }
                 }
                 localStorage.setItem("connections", JSON.stringify(this.currentItems));
                } 
             }, err => {
                console.error('ERROR', err);
             });
             }, (error) => {
             console.log(error);
           });
  }

  public response = (data) => {
console.log(data)
     this.events.publish('message', data);
  }
  @ViewChild('myTabs') tabRef: any;

  selectTab() {
    this.tabRef.select(2);
  }
}
