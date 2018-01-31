import { Component, ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { ActionSheetController,IonicPage, NavController, ViewController,NavParams } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { File , FileEntry} from '@ionic-native/file';
import { Api } from '../../providers/providers';
import { User } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;
  img:any;
  form: FormGroup;
   type:any;
username:any;
  constructor(public user: User,public navParams:NavParams,public api:Api,public actionSheetCtrl: ActionSheetController,private file:File,private http:HttpClient,private transfer: FileTransfer,public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera) {
    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      about: [''],
      file:['']
    });
this.username=this.navParams.get("username");
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }
  @ViewChild('myInput') myInput: ElementRef;
  
  resize() {
      this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }
  ionViewDidLoad() {

  }

    presentActionSheet() {
       let actionSheet = this.actionSheetCtrl.create({
         title: 'Chose photo',
         buttons: [
           {
             text: 'Camar',

             handler: () => {
              this.type=1;
              this.getPicture();
             }
           },
           {
             text: 'Gallary',
             handler: () => {
               this.type=0;
               this.getPicture();
             }
           }

         ]
       });

       actionSheet.present();
     }







  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.FILE_URI
        ,sourceType:this.type
      }).then((data) => {
        this.form.patchValue({ 'profilePic': data });
      //  this.img='data:image/jpg;base64,' + data;
        this.uploadPhoto(data);


      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }
  private uploadPhoto(imageFileUri: any): void {
    // this.error = null;

     this.file.resolveLocalFilesystemUrl(imageFileUri)
       .then(entry => (<FileEntry>entry).file(file => this.readFile(file)))
       .catch(err => console.log(err));
   }
   private readFile(file: any) {
   const reader = new FileReader();
   reader.onloadend = () => {
     const imgBlob = new Blob([reader.result], {type: file.type});
this.img=imgBlob;

   };
   reader.readAsArrayBuffer(file);
 }


  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;

      this.form.patchValue({ 'profilePic': imageData });
    };
//alert(event.target.file);
    reader.readAsDataURL(event.target.file);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }



  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
   // alert(this.img)
    this.postData(this.img);
    if (!this.form.valid) {

       return; }
    //this.viewCtrl.dismiss(this.form.value);
  }
  postData(Data:any) {
    const formData = new FormData();

   formData.append('posts', new Blob([JSON.stringify({
              "postTxt": this.form.controls['name'].value
            })], {
                type: "application/json"
            }));
            if(Data){
              formData.append('image', Data);
              
            }else{
              formData.append('image',new Blob([[]], {type: "NO"}));
          }
           // alert(this.api.url+"/posts");
      this.http.post<boolean>(this.api.url+"/posts", formData)

        .subscribe((resp) => {

        this.navCtrl.pop();
        }, (err) => {
          alert(err.http_status);
        });
    }
    uploadFile(img:any) {
      // let loader = this.loadingCtrl.create({
      //   content: "Uploading..."
      // });
      // loader.present();
      const fileTransfer: FileTransferObject = this.transfer.create();

      let options: FileUploadOptions = {
        fileKey: 'ionicfile',
        fileName: 'ionicfile.jpg',
        chunkedMode: false,
        mimeType: "image/jpeg",
      //  headers: {Authorization: `Bearer ${localStorage.getItem('id_token')}`,content-type:multipart/form-data},
        params :{posts:{"":""}}
      }
  //alert(this.imageURI);
      // fileTransfer.upload(img, 'http://192.168.43.74:8080/api/posts', options)
      //   .then((data) => {
      //   alert(data+" Uploaded Successfully");
      //   //this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
      // //  loader.dismiss();
      // //  this.presentToast("Image uploaded successfully");
      // }, (err) => {
      //   alert(err.http_status);
      // //  loader.dismiss();
      // //  this.presentToast(err);
      // });
    }


}
