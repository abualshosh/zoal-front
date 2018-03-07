import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { ActionSheetController,IonicPage, NavController, ViewController,NavParams } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { File , FileEntry} from '@ionic-native/file';
import { Api } from '../../providers/providers';
import { User } from '../../providers/providers';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  choseImage;
  cameraTitle;
  gallery;
  item: any;
  img:any;
  form: FormGroup;
   type:any;
username:any;
  constructor(public user: User,public navParams:NavParams,public api:Api,
    public actionSheetCtrl: ActionSheetController,private file:File,
    private http:HttpClient,private transfer: FileTransfer,
    public navCtrl: NavController, public viewCtrl: ViewController,
     formBuilder: FormBuilder, public camera: Camera
     ,public translateService:TranslateService
    ) {
      translateService.get(['ChoseImage', 'camera', 'gallery']).subscribe(values => {
        // alert("ds");
         this.choseImage = values['ChoseImage'];
         this.cameraTitle = values['camera'];
         this.gallery = values['gallery'];
         
       });
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

  ionViewDidLoad() {

  }

    presentActionSheet() {
       let actionSheet = this.actionSheetCtrl.create({
         title: this.choseImage,
         buttons: [
           {
             text: this.cameraTitle,

             handler: () => {
              this.type=1;
              this.getPicture();
             }
           },
           {
             text: this.gallery,
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
alert(event.target.file);
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
    alert(this.img)
    this.postData(this.img);
    if (!this.form.valid) {

       return; }
    //this.viewCtrl.dismiss(this.form.value);
  }
  postData(Data:any) {
    const formData = new FormData();
  

    formData.append('user', new Blob([JSON.stringify({
                "login":this.username
                ,"firstName": this.form.controls['name'].value
            })], {
                type: "application/json"
            }));
            if(Data){
              formData.append('image', Data);
              
            }else{
              formData.append('image',new Blob([[]], {type: "NO"}));
          }
            alert(this.api.url+"/posts");
      this.http.post<boolean>(this.api.url+"/users", formData)

        .subscribe((resp) => {
          let account:any={
            "username":this.username
            ,"password":this.username
          };
        //  this.account.password=this.account.username;
           this.user.login(account).subscribe((resp) => {
            localStorage.setItem('logdin',"true");

             this.navCtrl.setRoot('TabsPage');
           }, (err) => {

           });
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



















// import { Component, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Camera } from '@ionic-native/camera';
// import { IonicPage, NavController, ViewController } from 'ionic-angular';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { File } from '@ionic-native/file';
// import { ActionSheetController } from 'ionic-angular';
// @IonicPage()
// @Component({
//   selector: 'page-item-create',
//   templateUrl: 'item-create.html'
// })
// export class ItemCreatePage {
//   @ViewChild('fileInput') fileInput;
//
//   isReadyToSave: boolean=true;
//
//   item: any;
// dummyText:any;
//   form: FormGroup;
// imageURI:any;
//  type:any;
//   constructor(public actionSheetCtrl: ActionSheetController,private transfer: FileTransfer, private file: File,public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera) {
//     this.form = formBuilder.group({
//       profilePic: [''],
//       // name: ['', Validators.required],
//       // about: ['']
//     });
//
//     // Watch the form for changes, and
//     this.form.valueChanges.subscribe((v) => {
//       this.isReadyToSave = this.form.valid;
//     });
//   }
//
//   ionViewDidLoad() {
//
//   }
//
//   presentActionSheet() {
//      let actionSheet = this.actionSheetCtrl.create({
//        title: 'Chose photo',
//        buttons: [
//          {
//            text: 'Camar',
//
//            handler: () => {
//             this.type=1;
//             this.getPicture();
//            }
//          },
//          {
//            text: 'Gallary',
//            handler: () => {
//              this.type=0;
//              this.getPicture();
//            }
//          }
//
//        ]
//      });
//
//      actionSheet.present();
//    }
//   getPicture() {
//     //if (Camera['installed']()) {
//       this.camera.getPicture({
//         destinationType: this.camera.DestinationType.FILE_URI,
//         targetWidth: 96,
//         targetHeight: 96,
//         sourceType:this.type
//       }).then((data) => {
//          alert(data);
//          this.imageURI=data;
//         //this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
//       }, (err) => {
//         alert('Unable to take photo');
//       })
//   //  } else {
//   //    this.fileInput.nativeElement.click();
//   //  }
//   }
//
//   processWebImage(event) {
//     let reader = new FileReader();
//     reader.onload = (readerEvent) => {
//       const formData = new FormData();
//            const imgBlob = new Blob([reader.result], {type: event.target.files[0].type});
//            formData.append('file', imgBlob, event.target.files[0].name);
// console.log(event.target.files[0].type)
// console.log(imgBlob)
//            //this.postData(formData);
//       let imageData = (readerEvent.target as any).result;
//       this.form.patchValue({ 'profilePic': imageData });
//     };
//
//     reader.readAsDataURL(event.target.files[0]);
//   }
//
//   getProfileImageStyle() {
//     return 'url(' + this.form.controls['profilePic'].value + ')'
//   }
//
//   /**
//    * The user cancelled, so we dismiss without sending data back.
//    */
//   cancel() {
//     this.viewCtrl.dismiss();
//   }
//
//
//
//
//   uploadFile() {
//     // let loader = this.loadingCtrl.create({
//     //   content: "Uploading..."
//     // });
//     // loader.present();
//     const fileTransfer: FileTransferObject = this.transfer.create();
//
//     let options: FileUploadOptions = {
//       fileKey: 'ionicfile',
//       fileName: 'ionicfile.jpg',
//       chunkedMode: false,
//       mimeType: "image/jpeg",
//       headers: {}
//     }
// alert(this.imageURI);
//     fileTransfer.upload(this.imageURI, 'http://192.168.43.74:8080/api/posts', options)
//       .then((data) => {
//       alert(data+" Uploaded Successfully");
//       //this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
//     //  loader.dismiss();
//     //  this.presentToast("Image uploaded successfully");
//     }, (err) => {
//       alert(err.http_status);
//     //  loader.dismiss();
//     //  this.presentToast(err);
//     });
//   }
//   /**
//    * The user is done and wants to create the item, so return it
//    * back to the presenter.
//    */
//   done() {
//     console.log(this.form.controls.profilePic.value)
//     if (!this.form.valid) { return; }
//     this.viewCtrl.dismiss(this.form.value);
//   }
// }
