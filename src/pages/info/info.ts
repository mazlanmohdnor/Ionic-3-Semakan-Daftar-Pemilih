import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
// native emailcomposer
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
 

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  
}
