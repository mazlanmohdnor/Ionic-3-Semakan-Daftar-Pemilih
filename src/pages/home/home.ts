import { InAppBrowser } from '@ionic-native/in-app-browser';
import { InfoPage } from './../info/info';
import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, AlertController, ModalController, Events } from 'ionic-angular';
import { GoogleMap, GoogleMaps, LatLng, CameraPosition, GoogleMapsEvent, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { AdMobFreeBannerConfig, AdMobFree } from '@ionic-native/admob-free';
import { Device } from "@ionic-native/device";

//provider
import { MydaftarproviderProvider } from './../../providers/mydaftarprovider/mydaftarprovider';
import { NativeGeocoder, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  zoom: number=14;
  daerah: any;
  input: boolean = true;
  lokasi: string = 'Malaysia';
  lat = 4.2105;
  lng = 101.9758;
  public icNum: any;
  public details = {};
  masks: any;
  show: boolean = false;
  cover: boolean = true;
  map: GoogleMap;
  
//data binding
//  icData:any;
// nama:string;
// lokaliti:string;
// daerah :string;
// dun :string;
// parlimen:string;

  

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
 

  constructor(
    public navCtrl: NavController,
    public mydaftar: MydaftarproviderProvider,
    private nativeGeocoder: NativeGeocoder,
    public googleMaps: GoogleMaps,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public platform: Platform,
    public adMobFree: AdMobFree,
    public events: Events,
    public iab: InAppBrowser,
    // public device: Device
  ) {
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
//ads end


  ionViewDidLoad() {
    this.platform.ready().then(() => {
      


   
      //show ads
      this.showBannerAd();
     

      //reset app
      this.reset();
    })
   
  }
 
 

  mapFunction(lat,lng, lokasi,zoom) {
    //send to map
    let element = document.getElementById('map');
    this.map = this.googleMaps.create(element, {});
    let latlng = new LatLng(lat, lng);
    
    // let latlng = new LatLng(+coordinates.latitude, +coordinates.longitude);
    // console.log('The coordinates are latitude=' + coordinates.latitude + ' and longitude=' + coordinates.longitude)
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      let position: CameraPosition = {
        target: latlng,
        zoom: this.zoom,
        tilt: 30
      }
      this.map.moveCamera(position);
      let markeroptions: MarkerOptions = {
        position: latlng,
        title: lokasi
      };

      this.map.addMarker(markeroptions).then((marker: Marker) => {
        marker.showInfoWindow();
      })


      // map.setClickable(false);

      this.events.subscribe('sidebar:open', () => {
        this.map.setClickable(false);
      });

      this.events.subscribe('sidebar:close', () => {
        this.map.setClickable(true)
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
         
            this.icNum = "";
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
    this.map.setClickable(false);
    
    let prompt = this.alertCtrl.create({
      title: 'Maaf, Server SPR terlalu perlahan.',
      message: "Server SPR mengalami gangguan, sila cuba sebentar lagi.",

      buttons: [
        {
          text: 'Ok',
          handler: data => {


            this.icNum = "";
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

  // maintanance
  maintanance() {
    this.map.setClickable(false);
    
    let prompt = this.alertCtrl.create({
      title: 'Maaf, Sistem Mengalami Gangguan Sementara.',
      message: "Server SPR tidak dapat dihubungkan, klik 'Website SPR' untuk semak terus dari website.",

      buttons: [
        {
          text: 'Website SPR',
          handler: data => {
            this.iab.create('http://daftarj.spr.gov.my/', '_system');
          }
        },
        {
          text: 'Cancel',
          handler: data => {
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
    // this.maintanance();
    this.showLoading();
    let icNum = this.icNum.replace(/\D+/g, '');

   

    //generate token
    // let token = btoa(Math.round((new Date()).getTime() / 1000) + '.' + this.device.uuid);

    this.mydaftar.getDetail(icNum).subscribe(
      detail => {
        // let json = detail.json();
        // alert(detail.code);
       
        //  alert(status)

          // nak amik daerah
          let list: any[] = [];
          for (var key in detail.data) {
            if (detail.data.hasOwnProperty(key)) {
              list.push(detail.data[key]);
            }
          }
          //save daerah
          // this.daerah = json.warta.daerah;
          // console.log('list[6].substring(5): ', list[6].substring(5));


          //nak check code ,204 error, 200 ok, 504 "Server SPR terlalu perlahan."
          if (detail.code == 200) {
            this.details = detail.data;
            
            this.daerah = list[6].substring(5);
            
            this.show = true;
            this.mapGeo(this.daerah);
            this.dismissLoading();
          } if (detail.code == 204) {
            this.map.setClickable(false);
            this.show = false;
            this.showPrompt();
            this.dismissLoading();
            this.reset();
          } if (detail.code == 504) {
            this.map.setClickable(false);
            this.show = false;
            this.showPrompt2();
            this.dismissLoading();
            this.reset();
          } else {
            console.log("Code Error", detail.code);
          }
        
          //error code
          // alert(json.error);
          // if (json.error!== '') {
          //   this.show = false;
          //   this.dismissLoading();
          //   this.showPrompt();
          //   this.reset();
          // } else {
          //   this.show = true;
          //   this.icData = json.ic_no;
          //   this.nama = json.name;
          //   this.lokaliti = json.warta.lokaliti;
          //   this.daerah = json.warta.daerah;
          //   this.dun = json.warta.dun;
          //   this.parlimen = json.warta.parlimen;

          //   this.mapGeo(this.daerah);
          //   this.dismissLoading();
          // } 
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
    this.icNum = "";
    this.details = "";
    this.lat = 4.2105;
    this.lng = 101.9758;
    this.lokasi='Malaysia'
    this.show = false;
    this.input = true;
    this.mapFunction(this.lat, this.lng, this.lokasi, 6);
    this.dismissLoading();
    
  }

  enableInput() {
    var icU = this.icNum.replace(/\D+/g, '');
    
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
