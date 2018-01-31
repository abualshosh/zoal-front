import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { SQLite ,SQLiteObject  } from '@ionic-native/sqlite';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public sqlite:SQLite,public navCtrl: NavController) {

  //   this.sqlite.create({
  //     name: localStorage.getItem('username'),
  //     location: 'default'
  //   })
  //     .then((db: SQLiteObject) => {
  //
  //   db.executeSql("SELECT * FROM chats", []).then(data => {
  //      // this.items = [];
  //
  //       if(data.rows.length > 0) {
  //           for(var i = 0; i < data.rows.length; i++) {
  // alert(data.rows.item(i).otherUser)
  //      //         this.items.push(data.rows.item(i));
  //           }
  //       }
  //   }, (e) => {
  //
  //
  //       console.log("Errot: " + JSON.stringify(e));
  //   });
  //
  //     })
  //     .catch(e => console.log(e));
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
}
