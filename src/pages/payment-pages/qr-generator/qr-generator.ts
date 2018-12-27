import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Card } from "../../../models/cards";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";

/**
 * Generated class for the QrGeneratorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-qr-generator",
  templateUrl: "qr-generator.html"
})
export class QrGeneratorPage {
  public cards: Card[] = [];
  private todo: FormGroup;
  createdCode = null;

  constructor(
    private formBuilder: FormBuilder,
    public storage: Storage,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.storage.get("cards").then(val => {
      this.cards = val;
    });
    this.todo = this.formBuilder.group({
      Card: ["", Validators.required]
    });
  }
  onChange() {
    this.createdCode = this.todo.value.Card.pan;
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad QrGeneratorPage');
  }
}
