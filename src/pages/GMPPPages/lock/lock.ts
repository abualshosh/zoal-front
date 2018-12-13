import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

/**
 * Generated class for the LockPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-lock",
  templateUrl: "lock.html"
})
export class LockPage {
  list: any[];
  title;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.list = this.navParams.get("list");
    this.title = this.navParams.get("title");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LockPage");
  }
  open(page, name) {
    //this.openGmppSignup();
    if (name) {
      this.navCtrl.push(page, {
        name: name
      });
    } else {
      this.navCtrl.push(page);
    }
  }
  openPage(page) {
    this.navCtrl.push(page);
  }
}
