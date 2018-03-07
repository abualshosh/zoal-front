import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';
import { SQLite ,SQLiteObject  } from '@ionic-native/sqlite';
//import { StompService } from 'ng2-stomp-service';
import * as stompjs from 'stompjs';
import { FirstRunPage } from '../pages/pages';
import { Settings } from '../providers/providers';
import { ImageLoaderConfig } from 'ionic-image-loader';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = 'WelcomePage';
subscription:any;
  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Welcome', component: 'WelcomePage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Cards', component: 'CardsPage' },
    { title: 'Content', component: 'ContentPage' },
    { title: 'Login', component: 'LoginPage' },
    { title: 'Signup', component: 'SignupPage' },
    { title: 'Master Detail', component: 'ListMasterPage' },
    { title: 'Menu', component: 'MenuPage' },
    { title: 'Settings', component: 'SettingsPage' },
    { title: 'Search', component: 'SearchPage' }
  ]

  constructor(private imageLoaderConfig: ImageLoaderConfig,private sqlite: SQLite
    ,private translate: TranslateService, platform: Platform, settings: Settings, 
    private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    console.log(localStorage.getItem('logdin'));
    if (localStorage.getItem('logdin')=="true"){
    this.rootPage='TabsPage';
    }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      imageLoaderConfig.enableDebugMode();
      imageLoaderConfig.setImageReturnType('base64');
      this.statusBar.backgroundColorByHexString('#e0e0e0');
      this.statusBar.styleDefault();
     // this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.initTranslate();
      this.initChat();
    });

    
  }
initChat(){

// var stompClient = stompjs.client('ws://localhost:8080/websocket/tracker?access_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNDk5MjIxOTAyMDAiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZXhwIjoxNTExNjUyMTkxfQ.JnXdZGrJQmca9Zl2IlkmWxbdhV52OQZf4B3eScuhwTANgTKT00e_oBUI-bchrSCkHko2h0SSLAP9Jm78MbiGsg');
//       stompClient.debug = null;
//       stompClient.connect("","", ((frame) =>{
//           //setConnected(true);
//           console.log('Connected: ' + frame);
//           stompClient.subscribe('/user/queue/messages', function(greeting){
//           //    showGreeting(greeting.body);
//           console.log(greeting.body);
//           });
//       }));

  //
  // this.stomp.configure({
  //   host:'http://localhost:8080/websocket/tracker?access_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNDk5MjIxOTAyMDAiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZXhwIjoxNTExNjUyMTkxfQ.JnXdZGrJQmca9Zl2IlkmWxbdhV52OQZf4B3eScuhwTANgTKT00e_oBUI-bchrSCkHko2h0SSLAP9Jm78MbiGsg',
  //   debug:true,
  //   queue:{'init':false}
  // });
  //
  // //start connection
  // this.stomp.startConnect().then(() => {
  //   this.stomp.done('init');
  //   console.log('connected');
  //
  //   //subscribe
  //   this.subscription = this.stomp.subscribe('/destination', ((msg) => {
  //     console.log(msg);
  //
  //   }));
  //
  //   //send data
  //   //stomp.send('destionation',{"data":"data"});
  //
  //   //unsubscribe
  //   //this.subscription.unsubscribe();
  //
  //   //disconnect
  //   this.stomp.disconnect().then(() => {
  //     console.log( 'Connection closed' )
  //   })
  //
  // });


}


     findAll(db: SQLiteObject) {
//          db.executeSql("SELECT * FROM chats", []).then((data) => {
//             // this.items = [];
//
//              if(data.rows.length > 0) {
//                  for(var i = 0; i < data.rows.length; i++) {
// alert(data.rows.item(i).otherUser)
//             //         this.items.push(data.rows.item(i));
//                  }
//              }
//          }, (e) => {
//
//
//              console.log("Errot: " + JSON.stringify(e));
//          });
     }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
   // 
   var lang=localStorage.getItem("lang");

    if ( lang !== undefined && lang !== "" && lang !== null) {
      this.translate.setDefaultLang(localStorage.getItem("lang"));
      this.translate.use(localStorage.getItem("lang"));
    } else {
      this.translate.setDefaultLang('ar');
      this.translate.use('ar'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
