import { Component, OnInit } from '@angular/core';
import { connected } from 'node:process';
import { browser } from 'protractor';
import { Socket } from 'ngx-socket-io';
import { isObject } from 'util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  constructor(private socket: Socket) { }
  
  
  ngOnInit(): void {
  
  }
  


  deleteCookie(name: string) {
    const date:Date = new Date();
    
    // Set it expire in -1 days
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
    
    // Set it
    document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
  }

  getCookie(name:string) {
    let nameEQ:string = name + "=";
    let ca:string[] = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
      let c:string = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  connected(){
    return this.getCookie('token')?true: false;
  }
  
  Disconect(){
    this.deleteCookie('token');
    this.deleteCookie('username');
    this.deleteCookie('Builds');
  }
}
