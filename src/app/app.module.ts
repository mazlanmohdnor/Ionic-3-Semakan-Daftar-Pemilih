import { SocialSharing } from '@ionic-native/social-sharing';
import { InfoPage } from './../pages/info/info';
import { ParallaxHeaderDirective } from './../directives/parallax-header/parallax-header';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MydaftarproviderProvider } from '../providers/mydaftarprovider/mydaftarprovider';
import {TextMaskModule} from 'angular2-text-mask'

//ionic native
import { GoogleMaps } from '@ionic-native/google-maps';
import { EmailComposer } from '@ionic-native/email-composer';
import { AdMobFree } from '@ionic-native/admob-free';
import { AppRate } from '@ionic-native/app-rate';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from "@ionic-native/device";



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    InfoPage,
    ParallaxHeaderDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TextMaskModule,
    
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,    // Valid options appear to be [true, false]
      autoFocusAssist: false  // Valid options appear to be ['instant', 
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    InfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeGeocoder,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MydaftarproviderProvider,
    EmailComposer,
    SocialSharing,
    AdMobFree,
    AppRate,
    InAppBrowser,
    Device
  ]
})
export class AppModule {}
