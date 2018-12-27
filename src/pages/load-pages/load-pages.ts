import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-load-pages",
  templateUrl: "load-pages.html"
})
export class LoadPagesPage {
  list: any[];
  title;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.list = this.navParams.get("list");
    this.title = this.navParams.get("title");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoadPagesPage");
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
