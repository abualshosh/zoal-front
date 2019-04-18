import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { Contacts } from "@ionic-native/contacts";
import { Api } from "../../../providers/providers";
import { AlertProvider } from "../../../providers/alert/alert";
import { StorageProvider } from "../../../providers/storage/storage";
import * as lodash from "lodash";

@IonicPage()
@Component({
  selector: "page-contacts",
  templateUrl: "contacts.html"
})
export class ContactsPage {
  connections: any = [];
  contactsToUpload: any = [];

  constructor(
    public api: Api,
    private contacts: Contacts,
    public navCtrl: NavController,
    public alertProvider: AlertProvider,
    public storageProvider: StorageProvider,
    public events: Events,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    this.loadContacts();
  }

  loadContacts() {
    this.alertProvider.showLoading();
    this.api
      .get("profile-contacts/" + localStorage.getItem("profileId"))
      .subscribe(
        (res: any) => {
          if (res) {
            this.connections = res;
            localStorage.setItem("connections", this.connections);
            this.alertProvider.hideLoading();
          } else {
            this.alertProvider.hideLoading();
          }
        },
        err => {
          this.alertProvider.hideLoading();
          this.alertProvider.showToast("errorMessage");
        }
      );
  }

  uploadContacts() {
    this.alertProvider.showLoading();

    const opts = {
      multiple: true,
      hasPhoneNumber: true
    };

    this.contacts.find(["*"], opts).then(
      contacts => {
        contacts.forEach(contact => {
          contact.phoneNumbers.forEach(number => {
            let cont = number.value
              .replace(/ /g, "")
              .replace(")", "")
              .replace("(", "")
              .replace(/-/g, "")
              .trim()
              .replace(/^(\+249|00249|249|0)/g, "");
            if (cont) {
              this.contactsToUpload.push({
                phoneNumber: cont
              });
            }
          });
        });

        this.contactsToUpload = lodash.uniqWith(
          this.contactsToUpload,
          lodash.isEqual
        );

        this.api.post("profile-contacts", this.contactsToUpload).subscribe(
          (res: any) => {
            if (res) {
              this.connections = res;
              localStorage.setItem("connections", this.connections);
              this.contactsToUpload = [];
              this.alertProvider.hideLoading();
            } else {
              this.contactsToUpload = [];
              this.alertProvider.hideLoading();
            }
          },
          err => {
            this.contactsToUpload = [];
            this.alertProvider.hideLoading();
            this.alertProvider.showAlert("failedToUploadContacts", true);
          }
        );
      },
      error => {
        this.contactsToUpload = [];
        this.alertProvider.hideLoading();
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
