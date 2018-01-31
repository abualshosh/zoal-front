import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, IonicPage } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component({
  selector: 'page-slide-free-mode',
  templateUrl: 'slide-free-mode.html'
})
export class SlideFreeModePage {
  @ViewChild('slider') slider: Slides;
  createdCode = null;
  slides = [
    {
      title: 'Dream\'s Adventure',
      imageUrl: 'assets/img/lists/wishlist-1.jpg',
      songs: 2,
      private: false
    },
    {
      title: 'For the Weekend',
      imageUrl: 'assets/img/lists/wishlist-2.jpg',
      songs: 4,
      private: false
    },
    {
      title: 'Family Time',
      imageUrl: 'assets/img/lists/wishlist-3.jpg',
      songs: 5,
      private: true
    },
    {
      title: 'My Trip',
      imageUrl: 'assets/img/lists/wishlist-4.jpg',
      songs: 12,
      private: true
    }
  ];
  public pet: any = 'puppies';
  scanData: {};
  options: BarcodeScannerOptions;
  constructor(private nativePageTransitions: NativePageTransitions, private barcodeScanner: BarcodeScanner, public navCtrl: NavController) {
    this.createdCode = "12321312312312";
    // for (let i = 0; i < 20; i++) {
    //   this.slides.push(this.slides[i % 4]);
    // }
  }

  scan() {
    this.options = {
      prompt: "Scan your barcode "
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {

      //alert(barcodeData.text);
      if (barcodeData.text) {
        this.navCtrl.push('TransfaerToCardPage', {
          pan: barcodeData.text
        });
      }
      this.scanData = barcodeData;
    }, (err) => {
      console.log("Error occured : " + err);
    });
  }
  open(page) {
    let options: NativeTransitionOptions = {
      "direction": "left", // 'left|right|up|down', default 'left' (which is like 'next')
      "duration": 400, // in milliseconds (ms), default 400
      "slowdownfactor": -1, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
      "slidePixels": -1, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
      "iosdelay": 100, // ms to wait for the iOS webview to update before animation kicks in, default 60
      "androiddelay": 150, // same as above but for Android, default 70
      "winphonedelay": 250, // same as above but for Windows Phone, default 200,
      "fixedPixelsTop": 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
      "fixedPixelsBottom": 0  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
    };

    if (page == "MohePage") {
      // this.nativePageTransitions.slide(options);
      this.navCtrl.push(page, {
        title: "",
        name: "ARAB"
      });
    } else {
      // this.nativePageTransitions.slide(options);
      this.navCtrl.push(page);
    }
  }
  ngAfterViewInit() {
    //  this.slider.freeMode = true;
  }
}
