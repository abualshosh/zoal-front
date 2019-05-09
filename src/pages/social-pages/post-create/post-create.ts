import { Component, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Camera } from "@ionic-native/camera";
import {
  IonicPage,
  NavController,
  ViewController,
  NavParams
} from "ionic-angular";
import { Api } from "../../../providers/providers";
import { AlertProvider } from "../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-post-create",
  templateUrl: "post-create.html"
})
export class PostCreatePage {
  form: FormGroup;

  postImage: { image: any; imageContentType: any };
  cameraOptions: any;

  constructor(
    public navParams: NavParams,
    public api: Api,
    public navCtrl: NavController,
    public alertProvider: AlertProvider,
    public viewCtrl: ViewController,
    formBuilder: FormBuilder,
    public camera: Camera
  ) {
    this.postImage = { image: null, imageContentType: null };

    this.form = formBuilder.group({
      content: [""]
    });

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
  }

  @ViewChild("myInput") myInput: ElementRef;

  resize() {
    this.myInput.nativeElement.style.height =
      this.myInput.nativeElement.scrollHeight + "px";
  }

  getPicture() {
    if (Camera["installed"]()) {
      this.camera.getPicture(this.cameraOptions).then(
        data => {
          this.postImage.image = data;
          this.postImage.imageContentType = "image/jpeg";
        },
        err => {
          alert("Unable to take photo");
        }
      );
    }
  }

  done() {
    if (this.form.controls["content"].value || this.postImage.image) {
      this.postData();
    }
  }

  postData() {
    this.alertProvider.showLoading();

    let post = {
      content: this.form.controls["content"].value,
      image: this.postImage.image
        ? {
            image: this.postImage.image,
            imageContentType: this.postImage.imageContentType
          }
        : null,
      date: new Date()
    };

    this.api.post("posts", post).subscribe(
      res => {
        this.navCtrl.pop();
      },
      err => {
        this.alertProvider.hideLoading();
        this.alertProvider.showToast("failedToPost");
      },
      () => {
        this.alertProvider.hideLoading();
      }
    );
  }
}
