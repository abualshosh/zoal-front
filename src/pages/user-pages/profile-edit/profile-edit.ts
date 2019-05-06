import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertProvider } from "../../../providers/alert/alert";
import { User } from "../../../providers/providers";
import { Camera } from "@ionic-native/camera";
import { StorageProvider } from "../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-profile-edit",
  templateUrl: "profile-edit.html"
})
export class ProfileEditPage {
  private userForm: FormGroup;
  profile: any = {};
  submitAttempt: boolean = false;

  profileImage: { image: any; imageContentType: any };
  cameraOptions: {
    quality: number;
    targetWidth: number;
    targetHeight: number;
    destinationType: number;
    encodingType: number;
    mediaType: number;
    saveToPhotoAlbum: boolean;
    allowEdit: boolean;
    sourceType: number;
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public userProvider: User,
    public storageProvider: StorageProvider,
    public events: Events,
    public camera: Camera,
    public alertProvider: AlertProvider
  ) {
    this.profile = navParams.get("user");

    this.profileImage = { image: null, imageContentType: null };

    this.cameraOptions = {
      quality: 100,
      targetWidth: 900,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      allowEdit: true,
      sourceType: 0
    };

    this.userForm = this.formBuilder.group({
      image: [navParams.get("user") ? this.getImageSrc() : null],
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
        Validators.compose([Validators.maxLength(200)])
      ]
    });
  }

  selectImage() {
    if (Camera["installed"]()) {
      this.camera.getPicture(this.cameraOptions).then(
        data => {
          this.profileImage.image = data;
          this.profileImage.imageContentType = "image/jpeg";
        },
        err => {
          alert("Unable to take photo");
        }
      );
    }
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
        bio: this.userForm.controls["bio"].value,
        image: {
          image: this.profileImage.image,
          imageContentType: this.profileImage.imageContentType
        }
      };

      this.userProvider.updateProfile(this.profile).subscribe(
        res => {
          this.profile = res;
          this.events.publish("profile:updated", "");
          this.submitAttempt = false;

          if (!this.navParams.get("user")) {
            localStorage.setItem("logdin", "true");
            this.navCtrl.setRoot("TabsPage");
          } else {
            this.navCtrl.pop();
          }
        },
        err => {
          this.submitAttempt = false;
          this.alertProvider.showToast("failedToUpdateProfileInfo");
        },
        () => {
          this.alertProvider.hideLoading();
        }
      );
    }
  }

  getImageSrc() {
    if (this.profile.image) {
      return (
        "data:" +
        this.profile.image.imageContentType +
        ";base64," +
        this.profile.image.image
      );
    }
  }
}
