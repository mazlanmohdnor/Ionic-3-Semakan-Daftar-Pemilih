import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class MydaftarproviderProvider {

  constructor(public http: Http) {
    console.log('Hello MydaftarproviderProvider Provider');
  }

  // private ic = {
  //   ic: 920517105553,
   
  // }
  getDetail(ic) {
    return this.http.get('https://api.jomgeek.com/v1/spr/?k=HoJ0vOxDOqUD1uRA&a='+ic)
      .map(res => res.json());
  }

}
