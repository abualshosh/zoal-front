import { Component } from "@angular/core";
import {
  ViewController,
  IonicPage,
  NavController,
  NavParams
} from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: "page-transaction-detail",
  templateUrl: "transaction-detail.html"
})
export class TransactionDetailPage {
  public items: any[] = [];
  public main: any[] = [];

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public translateService: TranslateService,
    public navParams: NavParams
  ) {
    this.items = this.navParams.get("data");
    this.main = this.navParams.get("main");

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].tranCurrency) {
        //console.log(  this.items);
        translateService.get(["SDG"]).subscribe(values => {
          this.items[i].tranCurrency = values["SDG"];
        });
      }

      if (this.items[i].Card) {
        this.items[i].Card = this.items[i].Card.replace(
          this.items[i].Card.substring(6, this.items[i].Card.length - 3),
          "***********"
        );
      } else if (this.items[i].WalletNumber) {
        this.items[i].WalletNumber = this.items[i].WalletNumber.replace(
          this.items[i].WalletNumber.substring(
            6,
            this.items[i].WalletNumber.length - 3
          ),
          "*******"
        );
      }
    }
  }

  ionViewDidLoad() {}

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
