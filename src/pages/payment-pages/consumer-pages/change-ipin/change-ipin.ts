import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ModalController,
  Events
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import { AlertProvider } from "../../../../providers/alert/alert";
import { StorageProvider, Item } from "../../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-change-ipin",
  templateUrl: "change-ipin.html"
})
export class ChangeIpinPage {
  private todo: FormGroup;
  public cards: Item[] = [];
  submitAttempt: boolean = false;
  public GetServicesProvider: GetServicesProvider;

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public GetServicesProviderg: GetServicesProvider,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public navCtrl: NavController
  ) {
    this.GetServicesProvider = GetServicesProviderg;
    this.todo = this.formBuilder.group({
      Card: ["", Validators.required],
      IPIN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ],
      newIPIN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ],
      ConnewIPIN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ]
    });
  }

  ionViewWillEnter() {
    this.subscribeToDataChanges();
    this.loadData();
  }

  subscribeToDataChanges() {
    this.events.subscribe("data:updated", () => {
      this.todo.reset();
      this.loadData();
    });
  }

  loadData() {
    this.storageProvider.getCards().then(val => {
      this.cards = val;
    });
  }

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      this.alertProvider.showLoading();

      var dat = this.todo.value;

      if (dat.ConnewIPIN == dat.newIPIN) {
        dat.UUID = uuid.v4();
        dat.IPIN = this.GetServicesProvider.encrypt(dat.UUID + dat.IPIN);
        dat.newIPIN = this.GetServicesProvider.encrypt(dat.UUID + dat.newIPIN);
        dat.authenticationType = "00";
        dat.pan = dat.Card.cardNumber;
        dat.expDate = dat.Card.expDate;
        dat.ConnewIPIN = "";

        this.GetServicesProvider.load(dat, "consumer/ChangeIPIN").then(data => {
          if (data != null && data.responseCode == 0) {
            this.alertProvider.hideLoading();
            let modal = this.modalCtrl.create(
              "TransactionDetailPage",
              { data: [], main: [{ changeIpinPage: "" }] },
              { cssClass: "inset-modals" }
            );
            modal.present();
            this.todo.reset();
            this.submitAttempt = false;
          } else {
            this.alertProvider.hideLoading();
            this.alertProvider.showAlert(data);
            this.todo.reset();
            this.submitAttempt = false;
          }
        });
      } else {
        this.alertProvider.hideLoading();
        var data = { responseMessage: "IPIN Missmatch" };
        this.alertProvider.showAlert(data);
      }
    }
  }
}
