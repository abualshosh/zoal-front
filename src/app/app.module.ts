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
import { AuthHttp, AuthConfig, JwtHelper } from "angular2-jwt";
import { Settings } from "../providers/providers";
import { User, UserProvider } from "../providers/providers";
import { Api } from "../providers/providers";
import { GetServicesProvider } from "../providers/providers";
import { MyApp } from "./app.component";
import { AuthService, TokenInterceptor } from "../providers/providers";
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
// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: "Ionitron J. Framework",
    option3: "3",
    option4: "Hello"
  });
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
    UserProvider,
    FCM,
    NgxQRCodeModule,

    GetServicesProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
