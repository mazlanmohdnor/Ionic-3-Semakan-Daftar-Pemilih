import { InfoPage } from './../info/info';
import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { GoogleMap, GoogleMaps, LatLng, CameraPosition, GoogleMapsEvent, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { AdMobFreeBannerConfig, AdMobFree } from '@ionic-native/admob-free';

//provider
import { MydaftarproviderProvider } from './../../providers/mydaftarprovider/mydaftarprovider';
import { NativeGeocoder, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  zoom: number=12;
  daerah: any;
  icNum: number;
  input: boolean = true;
  lokasi: string = 'Malaysia';
  lat = 4.2105;
  lng = 101.9758;
  public ic: any;
  public details = {};
  masks: any;
  show: boolean = false;
  map: GoogleMap;
  public loader;
  // public loader = this.loadingCtrl.create({
  //   content: "Menyemak Data..",
  // });

  showLoading() {
    if (!this.loader) {
      this.loader = this.loadingCtrl.create({
        content: 'Menyemak Data...'
      });
      this.loader.present();
    }
  }
  dismissLoading() {
    if (this.loader) {
      this.loader.dismiss();
      this.loader = null;
    }
  }
 

  constructor(public navCtrl: NavController, public mydaftar: MydaftarproviderProvider, private nativeGeocoder: NativeGeocoder, public googleMaps: GoogleMaps, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl: ModalController, public platform:Platform, public adMobFree:AdMobFree) {
    this.masks = {
      ic: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    };

  }

 //ads
  async showBannerAd() {
    try {
      const bannerConfig: AdMobFreeBannerConfig = {
        id:'ca-app-pub-8469816531943468/4102330882',
        isTesting: false,
        autoShow: true
        // size:'320x32'
      }

      this.adMobFree.banner.config(bannerConfig);

      const result = await this.adMobFree.banner.prepare();
      console.log(result);
    }
    catch (e) {
      console.error(e);
    }
  }



  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.showBannerAd();
      
      this.reset();
    })
   
  }
 

  mapFunction(lat,lng, lokasi,zoom) {
    //semd to map
    let element = document.getElementById('map');
    let map: GoogleMap = this.googleMaps.create(element, {});
    let latlng = new LatLng(lat, lng);
    
    // let latlng = new LatLng(+coordinates.latitude, +coordinates.longitude);
    // console.log('The coordinates are latitude=' + coordinates.latitude + ' and longitude=' + coordinates.longitude)
    map.one(GoogleMapsEvent.MAP_READY).then(() => {
      let position: CameraPosition = {
        target: latlng,
        zoom: this.zoom,
        tilt: 30
      }
      map.moveCamera(position);
      let markeroptions: MarkerOptions = {
        position: latlng,
        title: lokasi
      };

      let marker = map.addMarker(markeroptions).then((marker: Marker) => {
        marker.showInfoWindow();
      })

    })
 }

 //code 202 
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Maaf, Tiada rekod ditemui.',
      message: "Anda mungkin belum mendaftar atau nombor kad pengenalan yang dimasukkan tidak tepat.",

      buttons: [
        {
          text: 'Ok',
          handler: data => {
         

            this.ic = "";
            this.details = "";
            this.lat = 4.2105;
            this.lng = 101.9758;
            this.lokasi = 'Malaysia'
            this.show = false;
            this.input = true;
            this.dismissLoading();
            prompt.dismiss();
            this.mapFunction(this.lat, this.lng, this.lokasi,this.zoom);
            this.map.setClickable(true);
          }
        }
      ]
    });
    prompt.present();
  }
  
  //code 504
  showPrompt2() {
    let prompt = this.alertCtrl.create({
      title: 'Maaf, Server SPR terlalu perlahan.',
      message: "Server SPR mengalami gangguan, sila cuba sebentar lagi.",

      buttons: [
        {
          text: 'Ok',
          handler: data => {


            this.ic = "";
            this.details = "";
            this.lat = 4.2105;
            this.lng = 101.9758;
            this.lokasi = 'Malaysia'
            this.show = false;
            this.input = true;
            this.dismissLoading();
            prompt.dismiss();
            this.mapFunction(this.lat, this.lng, this.lokasi, this.zoom);
            this.map.setClickable(true);
          }
        }
      ]
    });
    prompt.present();
  }


  getdetail() {

    this.showLoading();
    this.show = true;
    this.icNum = this.ic.replace(/\D+/g, '');


      this.mydaftar.getDetail(this.icNum).subscribe(
        detail => {
        
          //save data dlm details object
          this.details = detail.data;

          // nak amik daerah
          let list: any[] = [];
          for (var key in detail.data) {
            if (detail.data.hasOwnProperty(key)) {
              list.push(detail.data[key]);
            }
          }
          //save daerah
          this.daerah = list[3];


          //nak check code ,204 error, 200 ok, 504 "Server SPR terlalu perlahan."
          if (detail.code == 200) {
            this.mapGeo(this.daerah);
            this.dismissLoading();
          } if (detail.code == 204) {
            this.showPrompt();
            this.map.setClickable(false);
            this.reset();
          } if (detail.code == 504) {
            this.showPrompt2();
            this.map.setClickable(false);
            this.reset();
          } else {
            console.log("Code Error", detail.code);
          }
        }
      )  
  }

  mapGeo(daerah) {

    this.nativeGeocoder.forwardGeocode(daerah)
      .then((coordinates: NativeGeocoderForwardResult) => {
        this.lat = +coordinates.latitude;
        this.lng = +coordinates.longitude;

        this.mapFunction(this.lat, this.lng, daerah, this.zoom);

      });
  }
  
  reset() {
    this.ic = "";
    this.details = "";
    this.lat = 4.2105;
    this.lng = 101.9758;
    this.lokasi='Malaysia'
    this.show = false;
    this.input = true;
    this.mapFunction(this.lat, this.lng, this.lokasi, 18);
    this.dismissLoading();

  }

  enableInput() {
    var icU = this.ic.replace(/\D+/g, '');
    
    var icLenght = ('' + icU).length;
    // console.log(icLenght);
    // console.log(this.input);
    if (icLenght==12) {
      this.input = false;
    } 
   
  }

  //show modal
  presentModal() {
    this.navCtrl.push(InfoPage);
    // let modal = this.modalCtrl.create(InfoPage);
    // modal.present();
    // this.map.setClickable(false);
  }
}
