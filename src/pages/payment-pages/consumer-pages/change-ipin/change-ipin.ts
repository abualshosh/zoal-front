import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ModalController,
  Events
} from "ionic-angular";
import { Validators, FormBuilder } from "@angular/forms";
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
  public cards: any[] = [];
  submitAttempt: boolean = false;
  isReadyToSave: boolean;

  todo = this.formBuilder.group({
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

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public serviceProvider: GetServicesProvider,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public navCtrl: NavController
  ) {    
    this.todo.valueChanges.subscribe(v => {
      this.isReadyToSave = this.todo.valid;
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
    this.storageProvider.getCards().subscribe(res => {
      this.cards = res.body
      })    
  }

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      const form = this.todo.value;
      if (form.ConnewIPIN === form.newIPIN) {
        const tranUuid = uuid.v4();
        const request = {
          UUID: tranUuid,
          IPIN: this.serviceProvider.encrypt(tranUuid + form.IPIN),
          newIPIN: this.serviceProvider.encrypt(tranUuid + form.newIPIN),
          tranCurrency: "SDG",
          authenticationType: "00",
          pan: form.Card.cardNumber,
          expDate: form.Card.expDate
        };

        this.serviceProvider
          .doTransaction(request, "consumer/ChangeIPIN")
          .subscribe(res => {
            if (res != null && res.responseCode == 0) {
              let modal = this.modalCtrl.create(
                "TransactionDetailPage",
                { data: [], main: [{ changeIpinPage: "" }] },
                { cssClass: "inset-modals" }
              );
              modal.present();
              this.todo.reset();
              this.submitAttempt = false;
            } else {
              this.alertProvider.showAlert(res);
              this.todo.reset();
              this.submitAttempt = false;
            }
          });
      } else {
        this.alertProvider.showToast("validConnewIPINError");
      }
    }
  }
}
