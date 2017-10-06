import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { InfoPage } from './../info/info';
import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, AlertController, ModalController, Events, ToastController } from 'ionic-angular';
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
  negeri: any;
  button: boolean = false;
  parlimen: any;
  dun: any;
  lokaliti: any;
  nama: any;
  icData: any;
  zoom: number = 14;
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


  public loader;

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
    public socialshare: SocialSharing,
    public clipboard: Clipboard,
    public toast: ToastController,
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
    
  
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      let position: CameraPosition = {
        target: latlng,
        zoom: this.zoom,
        tilt: 30,
      }
      this.map.setMapTypeId('MAP_TYPE_HYBRID');
      this.map.moveCamera(position);
      let markeroptions: MarkerOptions = {
        position: latlng,
        title: lokasi
      };

      this.map.addMarker(markeroptions).then((marker: Marker) => {
        marker.showInfoWindow();
      })

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
          text: 'Cancel',
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
        },
        {
        text: 'Website SPR',
        handler: data => {
          this.iab.create('http://daftarj.spr.gov.my/', '_system');
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

    this.mydaftar.getDetail(icNum)
      .subscribe(
      details => {
        var json = details.json();
       
          // nak amik daerah
          // let list: any[] = [];
          // for (var key in detail.data) {
          //   if (detail.data.hasOwnProperty(key)) {
          //     list.push(detail.data[key]);
          //   }
          // }
          //save daerah
        this.daerah = json.warta.parlimen.substring(5);
        
        // alert(this.daerah);
          // console.log('list[6].substring(5): ', list[6].substring(5));


          //nak check code ,204 error, 200 ok, 504 "Server SPR terlalu perlahan."
          // if (detail.code == 200) {
          //   this.details = detail.data;
            
          //   this.daerah = list[6].substring(5);
            
          //   this.show = true;
          //   this.mapGeo(this.daerah);
          //   this.dismissLoading();
          // } if (detail.code == 204) {
          //   this.map.setClickable(false);
          //   this.show = false;
          //   this.showPrompt();
          //   this.dismissLoading();
          //   this.reset();
          // } if (detail.code == 504) {
          //   this.map.setClickable(false);
          //   this.show = false;
          //   this.showPrompt2();
          //   this.dismissLoading();
          //   this.reset();
          // } else {
          //   console.log("Code Error", detail.code);
          // }
        
          //error code
          // alert(json.error);
          if (json.error!== '') {
            this.show = false;
            this.map.setClickable(false);
            this.dismissLoading();
            this.showPrompt();
            this.reset();
          } else {
            this.show = true;
            this.icData = json.ic_no;
            this.nama = json.name;
            this.lokaliti = json.warta.lokaliti;
            this.daerah = json.warta.daerah;
            this.dun = json.warta.dun;
            this.parlimen = json.warta.parlimen;
            this.negeri = json.warta.negeri;

            this.mapGeo(json.warta.parlimen.substring(5));
            this.dismissLoading();
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
    this.button = false;
    
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

  close() {
    this.show = false;
    this.button = true;
  }

  open() {
    this.show = true;
    this.button = false;
  }

  share() {
    var options = {
      message: 'Nama: ' + this.nama + '\nLokaliti: ' + this.lokaliti + '\nDaerah Undi: ' + this.daerah+'\nDUN: '+ this.dun+'\nParlimen: '+this.parlimen+'\nNegeri: '+this.negeri+'\n\n-via Semakan Daftar Pemilih PRU',
      subject: 'Semakan Daftar Pemilih 2017: ' + this.nama,
      url: 'https://play.google.com/store/apps/details?id=my.mazlan.daftarpemilih',
      chooserTitle: 'Share via...'
    };

    this.socialshare.shareWithOptions(options);
  }

  copy() {
    this.clipboard.copy('Nama: ' + this.nama + '\nLokaliti: ' + this.lokaliti + '\nDaerah Undi: ' + this.daerah + '\nDUN: ' + this.dun + '\nParlimen: ' + this.parlimen + '\nNegeri: '+this.negeri+'\n\n-via Semakan Daftar Pemilih PRU').then(() => {
      let toast = this.toast.create({
        message: 'Copied to clipboard',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    });
  }

  enableInput() {
    var icU = this.icNum.replace(/\D+/g, '');
    var icLenght = ('' + icU).length;
    if (icLenght==12) {
      this.input = false;
    } 
  }

  //show modal
  presentModal() {
    this.navCtrl.push(InfoPage);
  }

}
