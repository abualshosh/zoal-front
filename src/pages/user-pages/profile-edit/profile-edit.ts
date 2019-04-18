import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  Events
} from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertProvider } from "../../../providers/alert/alert";
import { User } from "../../../providers/providers";
import { TranslateService } from "@ngx-translate/core";
import { Camera } from "@ionic-native/camera";
import { File, FileEntry } from "@ionic-native/file";
import { StorageProvider } from "../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-profile-edit",
  templateUrl: "profile-edit.html"
})
export class ProfileEditPage {
  private userForm: FormGroup;
  profile: any = {};
  type: number;
  img: Blob;
  submitAttempt: boolean = false;

  choseImage: string;
  cameraTitle: string;
  gallery: string;
  fileType: string;
  imagePath: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public actionSheetCtrl: ActionSheetController,
    public userProvider: User,
    public translateService: TranslateService,
    public storageProvider: StorageProvider,
    public events: Events,
    private file: File,
    public camera: Camera,
    public alertProvider: AlertProvider
  ) {
    this.profile = navParams.get("user");

    translateService
      .get(["ChoseImage", "camera", "gallery"])
      .subscribe(values => {
        this.choseImage = values["ChoseImage"];
        this.cameraTitle = values["camera"];
        this.gallery = values["gallery"];
      });

    this.userForm = this.formBuilder.group({
      image: [""],
      firstName: [
        navParams.get("user") ? this.profile.firstName : null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ])
      ],
      lastName: [
        navParams.get("user") ? this.profile.lastName : null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ])
      ],
      email: [
        navParams.get("user") ? this.profile.email : null,
        Validators.compose([
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
        ])
      ],
      bio: [
        navParams.get("user") ? this.profile.bio : null,
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(200)
        ])
      ],
      file: [""]
    });
  }

  selectImage() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.choseImage,
      buttons: [
        {
          text: this.cameraTitle,
          handler: () => {
            this.getPicture(1);
          }
        },
        {
          text: this.gallery,
          handler: () => {
            this.getPicture(0);
          }
        }
      ]
    });

    actionSheet.present();
  }

  getPicture(type: number) {
    this.camera
      .getPicture({
        destinationType: this.camera.DestinationType.FILE_URI,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: type
      })
      .then(
        imagePath => {
          // this.userForm.patchValue({ image: data });
          // this.userForm.controls["image"].setValue(imagePath);
          this.imagePath = imagePath;
          alert(this.imagePath);
          this.loadPhoto(imagePath);
        },
        err => {
          alert("Unable to take photo");
        }
      );
  }

  private loadPhoto(imageFileUri: any): void {
    this.file.resolveLocalFilesystemUrl(imageFileUri).then(
      entry => {
        (<FileEntry>entry).file(file => this.readFile(file));
      },
      err => {
        this.alertProvider.showAlert("failedToLoadImage");
      }
    );
  }

  private readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imgBlob = new Blob([reader.result], { type: file.type });
      this.img = imgBlob;
    };
    reader.readAsArrayBuffer(file);
  }

  postData() {
    this.submitAttempt = true;
    if (this.userForm.valid) {
      this.alertProvider.showLoading();

      this.profile = {
        id: localStorage.getItem("profileId"),
        login: localStorage.getItem("username"),
        firstName: this.userForm.controls["firstName"].value,
        lastName: this.userForm.controls["lastName"].value,
        email: this.userForm.controls["email"].value,
        bio: this.userForm.controls["bio"].value
      };

      if (this.img) {
        let imgData = {
          image: this.img,
          imageContentType: this.fileType
        };

        this.userProvider.changeProfilePicture(imgData).subscribe(res => {});
      }

      this.userProvider.updateProfile(this.profile).subscribe(
        res => {
          this.profile = res;
          this.storageProvider.setProfile(res).then(() => {
            this.events.publish("profile:updated", "");
            this.alertProvider.hideLoading();
            this.submitAttempt = false;

            if (!this.navParams.get("user")) {
              localStorage.setItem("logdin", "true");
              this.navCtrl.setRoot("TabsPage");
            } else {
              this.navCtrl.pop();
            }
          });
        },
        err => {
          this.alertProvider.showAlert(err);
          this.alertProvider.hideLoading();
          this.submitAttempt = false;
        }
      );
    }
  }
}
