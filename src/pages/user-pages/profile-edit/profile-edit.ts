import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
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
  @ViewChild("fileInput") fileInput;

  user: any = {};
  private userForm: FormGroup;
  type: number;
  img: Blob;
  submitAttempt: boolean = false;

  choseImage: string;
  cameraTitle: string;
  gallery: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public userProvider: User,
    public translateService: TranslateService,
    public storageProvider: StorageProvider,
    public events: Events,
    private file: File,
    public camera: Camera,
    public alertProvider: AlertProvider
  ) {
    this.storageProvider.getProfile().subscribe(val => {
      this.user = val;
    });

    translateService
      .get(["ChoseImage", "camera", "gallery"])
      .subscribe(values => {
        this.choseImage = values["ChoseImage"];
        this.cameraTitle = values["camera"];
        this.gallery = values["gallery"];
      });

    this.userForm = this.formBuilder.group({
      profilePic: [""],
      fullname: [
        null,
        Validators.compose([Validators.minLength(3), Validators.maxLength(20)])
      ],
      email: [
        null,
        Validators.compose([
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
        ])
      ],
      bio: [
        null,
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(200)
        ])
      ],
      file: [""]
    });
  }

  ionViewDidLoad() {}

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.choseImage,
      buttons: [
        {
          text: this.cameraTitle,

          handler: () => {
            this.type = 1;
            this.getPicture();
          }
        },
        {
          text: this.gallery,
          handler: () => {
            this.type = 0;
            this.getPicture();
          }
        }
      ]
    });

    actionSheet.present();
  }

  getPicture() {
    if (Camera["installed"]()) {
      this.camera
        .getPicture({
          destinationType: this.camera.DestinationType.FILE_URI,
          mediaType: this.camera.MediaType.PICTURE,
          sourceType: this.type
        })
        .then(
          data => {
            this.userForm.patchValue({ profilePic: data });
            this.uploadPhoto(data);
          },
          err => {
            alert("Unable to take photo");
          }
        );
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  private uploadPhoto(imageFileUri: any): void {
    this.file
      .resolveLocalFilesystemUrl(imageFileUri)
      .then(entry => (<FileEntry>entry).file(file => this.readFile(file)))
      .catch(err => console.log(err));
  }

  private readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imgBlob = new Blob([reader.result], { type: file.type });
      this.img = imgBlob;
    };
    reader.readAsArrayBuffer(file);
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = readerEvent => {
      let imageData = (readerEvent.target as any).result;

      this.userForm.patchValue({ profilePic: imageData });
    };
    reader.readAsDataURL(event.target.file);
  }

  getProfileImageStyle() {
    return "url(" + this.userForm.controls["profilePic"].value + ")";
  }

  postData() {
    this.submitAttempt = true;
    if (this.userForm.valid) {
      if (
        !this.userForm.controls["profilePic"].value &&
        !this.userForm.controls["fullname"].value &&
        !this.userForm.controls["email"].value &&
        !this.userForm.controls["bio"].value
      ) {
        this.submitAttempt = false;
        return;
      }

      let loader = this.loadingCtrl.create();
      loader.present();

      if (this.userForm.controls["fullname"].value) {
        this.user.fullName = this.userForm.controls["fullname"].value;
      }

      if (this.userForm.controls["email"].value) {
        this.user.email = this.userForm.controls["email"].value;
      }

      if (this.userForm.controls["bio"].value) {
        this.user.bio = this.userForm.controls["bio"].value;
      }

      if (this.img) {
        const formData = new FormData();
        formData.append(
          "user",
          new Blob(
            [
              JSON.stringify({
                login: this.user.userName
              })
            ],
            {
              type: "application/json"
            }
          )
        );

        formData.append("image", this.img);

        this.userProvider.updateProfilePic(formData).subscribe(res => {
          alert(res);
        });
      }

      this.userProvider.updateProfile(this.user).subscribe(
        res => {
          this.user = res;
          this.storageProvider.setProfile(res).then(() => {
            this.events.publish("profile:updated", "");
            loader.dismiss();
            this.submitAttempt = false;
            this.navCtrl.pop();
          });
        },
        err => {
          this.alertProvider.showAlert(err);
          loader.dismiss();
          this.submitAttempt = false;
        }
      );
    }
  }
}
