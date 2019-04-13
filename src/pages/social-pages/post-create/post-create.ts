import { Component, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Camera } from "@ionic-native/camera";
import {
  ActionSheetController,
  IonicPage,
  NavController,
  ViewController,
  NavParams
} from "ionic-angular";
import { File, FileEntry } from "@ionic-native/file";
import { Api } from "../../../providers/providers";
import { User } from "../../../providers/providers";
import { TranslateService } from "@ngx-translate/core";
import { AlertProvider } from "../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-post-create",
  templateUrl: "post-create.html"
})
export class PostCreatePage {
  @ViewChild("fileInput") fileInput;

  isReadyToSave: boolean;
  img: any;
  form: FormGroup;
  choseImage: string;
  cameraTitle: string;
  gallery: string;
  imagePath: any;
  fileType: string;

  constructor(
    public user: User,
    public navParams: NavParams,
    public api: Api,
    public actionSheetCtrl: ActionSheetController,
    private file: File,
    public translateService: TranslateService,
    public navCtrl: NavController,
    public alertProvider: AlertProvider,
    public viewCtrl: ViewController,
    formBuilder: FormBuilder,
    public camera: Camera
  ) {
    translateService
      .get(["ChoseImage", "camera", "gallery"])
      .subscribe(values => {
        this.choseImage = values["ChoseImage"];
        this.cameraTitle = values["camera"];
        this.gallery = values["gallery"];
      });

    this.form = formBuilder.group({
      image: [""],
      content: ["", Validators.required],
      about: [""],
      file: [""]
    });

    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  @ViewChild("myInput") myInput: ElementRef;

  resize() {
    this.myInput.nativeElement.style.height =
      this.myInput.nativeElement.scrollHeight + "px";
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
        (<FileEntry>entry).file(file => {
          this.fileType = file.type;
          this.readFile(file);
        });
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

  done() {
    this.postData();
    if (!this.form.valid) {
      return;
    }
  }

  postData() {
    this.alertProvider.showLoading();

    let post = {
      content: this.form.controls["content"].value,
      date: new Date()
    };

    this.api.post("posts", post).subscribe(
      resp => {
        if (this.img) {
          let imgData = [
            {
              image: this.img,
              imageContentType: this.fileType,
              post: post
            }
          ];
          this.api.post("post-images", imgData).subscribe(
            res => {},
            err => {
              this.alertProvider.hideLoading();
              this.alertProvider.showToast("failedToPostImage");
            }
          );
        }

        this.alertProvider.hideLoading();
        this.navCtrl.pop();
      },
      err => {
        this.alertProvider.hideLoading();
        this.alertProvider.showToast("failedToPost");
      }
    );
  }
}
