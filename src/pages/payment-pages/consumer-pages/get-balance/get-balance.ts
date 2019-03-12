import { Component } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import {
  LoadingController,
  ModalController,
  IonicPage,
  NavController,
  Events
} from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import * as moment from "moment";
import { AlertProvider } from "../../../../providers/alert/alert";
import { StorageProvider, Item } from "../../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-get-balance",
  templateUrl: "get-balance.html"
})
export class GetBalancePage {
  private todo: FormGroup;
  public cards: Item[] = [];
  submitAttempt: boolean = false;
  public GetServicesProvider: GetServicesProvider;

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    public navCtrl: NavController,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController
  ) {
    //  user.printuser();
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
      let loader = this.loadingCtrl.create();
      loader.present();
      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.IPIN = this.GetServicesProvider.encrypt(dat.UUID + dat.IPIN);

      dat.tranCurrency = "SDG";

      dat.authenticationType = "00";
      dat.fromAccountType = "00";
      dat.pan = dat.Card.cardNumber;
      dat.expDate = dat.Card.expDate;

      this.GetServicesProvider.load(dat, "consumer/getBalance").then(data => {
        if (data != null && data.responseCode == 0) {
          loader.dismiss();
          var main = [];
          var mainData = {
            balance: data.balance.available
          };
          main.push(mainData);
          var datas;
          var dat = [];
          var datetime = moment(data.tranDateTime, "DDMMyyHhmmss").format(
            "DD/MM/YYYY  hh:mm:ss"
          );
          datas = {
            Card: data.PAN,
            balance: data.balance.available,
            date: datetime
          };
          dat.push(datas);
          let modal = this.modalCtrl.create(
            "TransactionDetailPage",
            { data: dat, main: main },
            { cssClass: "inset-modal" }
          );
          modal.present();
          this.todo.reset();
          this.submitAttempt = false;
        } else {
          loader.dismiss();
          if (data.responseCode != null) {
            this.alertProvider.showAlert(data);
          } else {
            data.responseMessage = "Connection Error";
            this.alertProvider.showAlert(data);
          }
          this.todo.reset();
          this.submitAttempt = false;
        }
      });
    }
  }
}
