import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import * as NodeRSA from 'node-rsa';
import {Storage} from '@ionic/storage';
import { Api } from '../api/api';
import * as JSEncrypt from 'jsencrypt';

/*
  Generated class for the GetServicesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GetServicesProvider {

public data : any;
public module:string="";
public dataListCon : any;
public dataListGMPP : any;
public URL:string="http://localhost:8080/api";
  constructor(public api: Api,public http: HttpClient,public alertCtrl: AlertController,public storage:Storage) {

    console.log('Hello GetServicesProvider Provider');
    this.storage.get('module').then((val) => {
        if (val!=null){
    this.module=val;}
      });

  }

  setModule(module:string){


    this.module=module;

  }
  showAlert(balance : any ) {
   let alert = this.alertCtrl.create({
     title: 'Balance!',
     message: 'Your Balance is!'+balance.balance.available,

     buttons: ['OK'],
      cssClass: 'alertCustomCss'
   });
   alert.present();
 }
 encrypt(msg : any){
 //var ursa: any;
 //var key=ursa.createPublicKeyFromComponents('9E07C2D85FA9788AD3D0204A19E72EA02A3324F955457486F49D1BEC92331F9AE78522E444AD9263BC88E7551BD0E55AFE7978B068A1D8D27DDD1747137B6A7D','010001');
 //return  key.encrypt(msg, 'utf8', 'base64');
 //var uuidV4=new uuidV4();

 //var key = new NodeRSA("-----BEGIN RSA PRIVATE KEY----- MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANx4gKYSMv3CrWWsxdPfxDxFvl+Is/0kc1dvMI1yNWDXI3AgdI4127KMUOv7gmwZ6SnRsHX/KAM0IPRe0+Sa0vMCAwEAAQ== -----END RSA PRIVATE KEY-----","pkcs1");
 var encrypt = new JSEncrypt.JSEncrypt();
 
 encrypt.setPublicKey("MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ4HwthfqXiK09AgShnnLqAqMyT5VUV0hvSdG+ySMx+a54Ui5EStkmO8iOdVG9DlWv55eLBoodjSfd0XRxN7an0CAwEAAQ==");
 
 var encrypted = encrypt.encrypt(msg);	
 // key.importKey({
 //     n: new Buffer(this.module, 'hex'),
 //     e: 65537,
 //     d:null,
 //     p: null,
 //     q: null,
 //     dmp1: null,
 //     dmq1: null,
 //     coeff: null
 // }, 'components-public');
 //var publicComponents = key.exportKey('components-public');
 //console.log(publicComponents);
 return encrypted;
 }
 encryptGmpp(msg : any){
  var encrypt = new JSEncrypt.JSEncrypt();
  
  encrypt.setPublicKey("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjqmUrQ1w1rOH+kmj4dk3C3duIl1trVRr91EJKhphlWjOs2qqba9I2WmRH3CVUuBmkIEojYrnKtXiQBqMOTANzZuly6vZY3AOT/JVDtKy3/z60mUWUi+ILidh5dZz7ZYKsPupXRz5XQXELLpI4XN58N1oiNY95GutJ/hjqE0qqufQ1ie/hU5Dbof9F+Ug3wSJOzba+IVve09Yx76KsFBtc+0qn2/JI7YPca9s8h4ZKaVo7qvFZNScTieoR5f3vaKUsYNTdRK7HMXEU/BMrg8hzh04+ShtDtKtQ02pvObQ+Kha/oV54bdP5e6m9NpXupoL0ydQIDNZ6B76yVEe5WJM2wIDAQAB");
  
  var encrypted = encrypt.encrypt(msg);	

  return encrypted;
  }

  load( postparams : any,path:string) : Promise<any> {
//    if (this.dataListCon&&path=='getPayee') {
//       // already loaded data
//   //
//return Promise.resolve(this.data);
//     }
//
//     // don't have the data yet

    return new Promise(resolve => {

      let seq = this.api.post(path, postparams).share();

      seq.subscribe((res: any) => {
        console.log(res);
        // If the API returned a successful response, mark the user as logged in
      resolve(res);
      }, err => {
      resolve(err);
      });



//       // We're using Angular HTTP provider to request the data,
//       // then on the response, it'll map the JSON data to a parsed JS object.
//       // Next, we process the data and resolve the promise with the new data.
//       var headers = new Headers();
//
//    headers.append('Content-Type', 'application/json' );
//    let options = new RequestOptions({ headers: headers });
//
// //  alert(postparams);
//   //  alert(JSON.stringify(postparams));
//
//    this.storage.get('username').then((val) => {
//       console.log(val);
//   if (val!=null){
//
//       postparams.username=val;
//   }
//   console.log(postparams);
//       this.http.post(this.URL+'/'+path,JSON.stringify(postparams),options)
//         .map(res => res.json())
//         .subscribe(data => {
//           // we've got back the raw data, now generate the core schedule data
//           // and save the data for later reference
//               console.log(data);
//           this.data = data;
//           resolve(this.data);
//         } , error => {
//
//         resolve(error);
//         });
//
//         // if (path!='getPayee') {
//   this.data=null;
//   //}else{
//   //    this.dataList=this.data;
//   //     this.data=null;
//  // }
//
//
//
//
//     });

    });

  }

 loadList( postparams : any,path:string) : Promise<any> {
//      if (this.dataListCon) {
//       // already loaded data
//   //
  return Promise.resolve(this.dataListCon);
//     }
//
//     // don't have the data yet
//     return new Promise(resolve => {
//       // We're using Angular HTTP provider to request the data,
//       // then on the response, it'll map the JSON data to a parsed JS object.
//       // Next, we process the data and resolve the promise with the new data.
//       var headers = new Headers();
//
//    headers.append('Content-Type', 'application/json' );
//    let options = new RequestOptions({ headers: headers });
//    this.storage.get('username').then((val) => {
//       console.log(val);
//   if (val!=null){
//
//       postparams.username=val;
//   }
// // //  alert(postparams);
// //   //  alert(JSON.stringify(postparams));
// //       this.http.post(this.URL+'/Pers/'+path,JSON.stringify(postparams),null)
// //         .map(res => res.json())
// //         .subscribe(data => {
// //           // we've got back the raw data, now generate the core schedule data
// //           // and save the data for later reference
// //           this.dataListCon = data;
// //           resolve(this.dataListCon);
// //         } , error => {
// //
// //         resolve(error);
// //         });
// //        });
// //     });
// //
   }
//
//
  loadGmppList( postparams : any,path:string) : Promise<any> {
//      if (this.dataListGMPP) {
//       // already loaded data
//   //
  return Promise.resolve(this.dataListGMPP);
//     }
//
//     // don't have the data yet
//     return new Promise(resolve => {
//       // We're using Angular HTTP provider to request the data,
//       // then on the response, it'll map the JSON data to a parsed JS object.
//       // Next, we process the data and resolve the promise with the new data.
//       var headers = new Headers();
//
//    headers.append('Content-Type', 'application/json' );
//    let options = new RequestOptions({ headers: headers });
//
// //  alert(postparams);
//   //  alert(JSON.stringify(postparams));
//       this.http.post(this.URL+'/gmpp/'+path,JSON.stringify(postparams),null)
//         .map(res => res.json())
//         .subscribe(data => {
//           // we've got back the raw data, now generate the core schedule data
//           // and save the data for later reference
//           this.dataListGMPP = data;
//           resolve(this.dataListGMPP);
//         } , error => {
//
//         resolve(error);
//         });
//
//     });

  }












  loadGmpp( postparams : any,path:string) : Promise<any> {
//      if (this.dataListGMPP&&path=='getPayee') {
//       // already loaded data
//   //
 return Promise.resolve(this.data);
//     }
//
//     // don't have the data yet
//     return new Promise(resolve => {
//       // We're using Angular HTTP provider to request the data,
//       // then on the response, it'll map the JSON data to a parsed JS object.
//       // Next, we process the data and resolve the promise with the new data.
//       var headers = new Headers();
//
//    headers.append('Content-Type', 'application/json' );
//    let options = new RequestOptions({ headers: headers });
//
// //  alert(postparams);
//   //  alert(JSON.stringify(postparams));
//       this.http.post(this.URL+'/gmpp/'+path,JSON.stringify(postparams),null)
//         .map(res => res.json())
//         .subscribe(data => {
//           // we've got back the raw data, now generate the core schedule data
//           // and save the data for later reference
//           this.data = data;
//           resolve(this.data);
//         } , error => {
//
//         resolve(error);
//         });
//    //     if (path!='getPayee') {
//   this.data=null;
//  // }else{
//  //     this.dataList=this.data;
//  //      this.data=null;
//  // }
//     });

  }





  loadCommen( postparams : any,path:string) : Promise<any> {
//     if (this.data) {
//       // already loaded data
//   //
 return Promise.resolve(this.data);
//     }
//
//     // don't have the data yet
//     return new Promise(resolve => {
//       // We're using Angular HTTP provider to request the data,
//       // then on the response, it'll map the JSON data to a parsed JS object.
//       // Next, we process the data and resolve the promise with the new data.
//       var headers = new Headers();
//
//    headers.append('Content-Type', 'application/json' );
//    let options = new RequestOptions({ headers: headers });
//
// //  alert(postparams);
//   //  alert(JSON.stringify(postparams));
//       this.http.post(this.URL+'/Commen/'+path,JSON.stringify(postparams),null)
//         .map(res => res.json())
//         .subscribe(data => {
//           // we've got back the raw data, now generate the core schedule data
//           // and save the data for later reference
//           this.data = data;
//           resolve(this.data);
//         } , error => {
//
//         resolve(error);
//         });
//   this.data=null;
//     });

  }
}
