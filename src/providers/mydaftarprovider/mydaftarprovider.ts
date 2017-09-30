import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class MydaftarproviderProvider {

  constructor(public http: Http) {
    console.log('Hello MydaftarproviderProvider Provider');
  }

  // private ic = {
  //   ic: 920517105553,
   
  // }
  getDetail(ic_no) {

    // let info = new URLSearchParams();
    // info.append('ic', ic);
    // info.append('token', 'MTUwNjY1NzAyOC44Zmg0a2NmM2pmaWdmZA');
    // info.append('token', token);

    return this.http.get('https://api.jomgeek.com/v1/spr/?k={{api}}='+ic_no)
      .map(res => res.json());
    // return this.http.post('http://myspr.spr.gov.my/semak.php', info)
      // .map(res => {
      //   res
      // });
    
  }

}
