import { EmailComposer } from '@ionic-native/email-composer';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
// native emailcomposer
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
 

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private emailComposer: EmailComposer, public social:SocialSharing) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  sendEmail() {


    this.emailComposer.addAlias('gmail', 'com.google.android.gm');

    this.emailComposer.open({
      app: 'gmail',
      to: 'lan.psis@gmail.com',

      subject: 'Hi dari Aplikasi Semakan Daftar Pemilih',
      body: 'Semak status daftar pemilih anda dengan mudah dan cepat dengan menggunakan Aplikasi Semakan Daftar Pemilih. Muat turun sekarang di Google Playstore: https://play.google.com/store/apps/details?id=my.mazlan.daftarpemilih',
      isHtml: true
    });


  }


  share() {
    var options = {
      message: 'Semak status daftar pemilih anda dengan mudah dan cepat dengan menggunakan Aplikasi Semakan Daftar Pemilih. Muat turun sekarang di Google Playstore:',
      subject: 'Applikasi Semakan Daftar Pemilih',
      url: 'https://play.google.com/store/apps/details?id=my.mazlan.daftarpemilih',
      chooserTitle: 'Share via...'
    };

 

    this.social.shareWithOptions(options);
  }
}
