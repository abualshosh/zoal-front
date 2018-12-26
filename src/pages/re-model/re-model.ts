import { Component } from "@angular/core";
import { IonicPage, ViewController, NavParams } from "ionic-angular";
import { ObjNgForPipe } from "../../pipes/obj-ng-for/obj-ng-for";
import { Pipe, PipeTransform } from "@angular/core";
/**
 * Generated class for the ReModelPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-re-model",

  templateUrl: "re-model.html"
})
export class ReModelPage {
  public items: any[] = [];
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.items = this.navParams.get("data");
    var i: any;
    for (i = 0; i < this.items.length; i++) {
      if (this.items[i].desc == null || this.items[i].desc == "") {
        this.items.splice(i, 1);
      }
    }
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ReModelPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
