import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { Contacts } from "@ionic-native/contacts";
import { Api } from "../../../providers/providers";
import { AlertProvider } from "../../../providers/alert/alert";
import { StorageProvider } from "../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-contacts",
  templateUrl: "contacts.html"
})
export class ContactsPage {
  connections: any = [];
  username: any;
  upcontacts: any = [];
  profile: any;

  constructor(
    public api: Api,
    private contacts: Contacts,
    public navCtrl: NavController,
    public alertProvider: AlertProvider,
    public storageProvider: StorageProvider,
    public events: Events,
    public navParams: NavParams
  ) {
    this.username = localStorage.getItem("username");
    this.connections = JSON.parse(localStorage.getItem("connections"));

    this.storageProvider.getProfile().subscribe(val => {
      this.profile = val;
    });
  }

  ionViewDidLoad() {
    this.uploadContacts();
  }

  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.connections = JSON.parse(localStorage.getItem("connections"));
      return;
    }
    if (this.connections) {
      this.connections = this.connections.filter(v => {
        if (v.fullName.toLowerCase().indexOf(val.toLowerCase()) > -1) {
          return true;
        }

        return false;
      });
    }
  }

  uploadContacts() {
    this.alertProvider.showLoading();

    var opts = {
      multiple: true,
      hasPhoneNumber: true
    };

    this.contacts.find(["*"], opts).then(
      contacts => {
        for (let i = 0; i < contacts.length; i++) {
          for (let j = 0; j < contacts[i].phoneNumbers.length; j++) {
            let cont = contacts[i].phoneNumbers[j].value;
            contacts[i].phoneNumbers[j].value = cont
              .replace(/ /g, "")
              .replace(")", "")
              .replace("(", "")
              .replace("-", "")
              .trim()
              .replace(/^(\+249|00249|249|0)/g, "");
            if (contacts[i].phoneNumbers[j].value) {
              this.upcontacts.push({
                login: contacts[i].phoneNumbers[j].value
              });
            }
          }
        }

        this.api.post("connections", this.upcontacts).subscribe(
          (res: any) => {
            if (res) {
              this.connections = [];
              for (let i = 0; i < res.length; i++) {
                if (res[i].profileOne.userName != this.username) {
                  this.connections.push(res[i].profileOne);
                } else if (res[i].profileTow.userName != this.username) {
                  this.connections.push(res[i].profileTow);
                }
              }
              localStorage.setItem(
                "connections",
                JSON.stringify(this.connections)
              );
              this.alertProvider.hideLoading();
              this.upcontacts = [];
            } else {
              this.alertProvider.hideLoading();
              this.upcontacts = [];
            }
          },
          err => {
            this.alertProvider.hideLoading();
            this.upcontacts = [];
            this.alertProvider.showAlert("failedToUploadContacts", true);
          }
        );
      },
      error => {
        this.alertProvider.hideLoading();
        this.upcontacts = [];
        this.alertProvider.showAlert("failedToReadContacts", true);
      }
    );
  }

  openProfile(item: any) {
    this.navCtrl.push("ProfilePage", {
      item: item
    });
  }
}
