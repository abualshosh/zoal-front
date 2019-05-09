import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Camera } from "@ionic-native/camera";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { IonicStorageModule, Storage } from "@ionic/storage";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { User } from "../providers/providers";
import { Api } from "../providers/providers";
import { GetServicesProvider } from "../providers/providers";
import { MyApp } from "./app.component";
import {
  AuthService,
  AuthInterceptor,
  AuthExpiredInterceptor
} from "../providers/providers";
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { Contacts } from "@ionic-native/contacts";
import { SQLite } from "@ionic-native/sqlite";
import { StompService } from "ng2-stomp-service";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { FCM } from "@ionic-native/fcm";
import { Firebase } from "@ionic-native/firebase";
import { IonicImageLoader } from "ionic-image-loader";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { NativePageTransitions } from "@ionic-native/native-page-transitions";
import { CardIO } from "@ionic-native/card-io";
import { StorageProvider } from "../providers/storage/storage";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AlertProvider } from "../providers/alert/alert";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Screenshot } from "@ionic-native/screenshot";
// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxQRCodeModule,
    IonicImageLoader.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: "__mydb",
      driverOrder: ["indexeddb", "sqlite", "websql"]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],

  providers: [
    Api,
    User,
    File,
    PhotoViewer,
    Contacts,
    CardIO,
    Camera,
    Firebase,
    FileTransfer,
    AuthService,
    SplashScreen,
    StatusBar,
    BarcodeScanner,
    SQLite,
    NativePageTransitions,
    StompService,
    FCM,
    NgxQRCodeModule,
    InAppBrowser,
    GetServicesProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true
    },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    StorageProvider,
    AlertProvider,
    SocialSharing,
    Screenshot
  ]
})
export class AppModule {}
