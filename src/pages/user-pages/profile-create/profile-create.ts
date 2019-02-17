import { Component, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Camera } from "@ionic-native/camera";
import {
  ActionSheetController,
  IonicPage,
  NavController,
  ViewController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { HttpClient, HttpParams } from "@angular/common/http";
import { File, FileEntry } from "@ionic-native/file";
import { Api } from "../../../providers/providers";
import { User } from "../../../providers/providers";
import { TranslateService } from "@ngx-translate/core";
import { AlertProvider } from "../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-profile-create",
  templateUrl: "profile-create.html"
})
export class ProfileCreatePage {
  @ViewChild("fileInput") fileInput;

  isReadyToSave: boolean;
  choseImage;
  cameraTitle;
  gallery;
  item: any;
  img: any;
  form: FormGroup;
  type: any;
  username: any;

  constructor(
    public user: User,
    public navParams: NavParams,
    public api: Api,
    public actionSheetCtrl: ActionSheetController,
    private file: File,
    private http: HttpClient,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    formBuilder: FormBuilder,
    public camera: Camera,
    public loadingCtrl: LoadingController,
    public translateService: TranslateService,
    public alertProvider: AlertProvider
  ) {
    translateService
      .get(["ChoseImage", "camera", "gallery"])
      .subscribe(values => {
        this.choseImage = values["ChoseImage"];
        this.cameraTitle = values["camera"];
        this.gallery = values["gallery"];
      });
    this.form = formBuilder.group({
      profilePic: [""],
      name: ["", Validators.required],
      about: [""],
      file: [""]
    });
    this.username = this.navParams.get("username");
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
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
          sourceType: this.type
        })
        .then(
          data => {
            this.form.patchValue({ profilePic: data });
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

      this.form.patchValue({ profilePic: imageData });
    };

    reader.readAsDataURL(event.target.file);
  }

  getProfileImageStyle() {
    return "url(" + this.form.controls["profilePic"].value + ")";
  }

  done() {
    this.postData(this.img);
    if (!this.form.valid) {
      return;
    }
  }

  postData(Data: any) {
    const formData = new FormData();

    let loader = this.loadingCtrl.create();
    loader.present();
    formData.append(
      "user",
      new Blob(
        [
          JSON.stringify({
            login: this.username,
            firstName: this.form.controls["name"].value
          })
        ],
        {
          type: "application/json"
        }
      )
    );
    if (Data) {
      formData.append("image", Data);
    } else {
      formData.append("image", new Blob([], { type: "NO" }));
    }
    this.api.post("users", formData).subscribe(
      resp => {
        let account: any = {
          username: this.username,
          password: this.username
        };
        this.user.login(account).subscribe(
          resp => {
            localStorage.setItem("logdin", "true");
            loader.dismiss();
            this.navCtrl.setRoot("TabsPage");
          },
          err => {
            loader.dismiss();
            this.alertProvider.showAlert(err);
          }
        );
      },
      err => {
        loader.dismiss();
        this.alertProvider.showAlert(err);
      }
    );
  }
}
