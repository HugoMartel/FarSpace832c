import { Component, OnInit } from '@angular/core';
import { connected } from 'node:process';
import { browser } from 'protractor';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent implements OnInit {

  constructor() { }
  
  ngOnInit(): void {
    console.log('hi its me Mario');
    if(this.getCookie('token')!=null){
      let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE2MjE1ODE3NjUsImV4cCI6MTYyMTY2ODE2NX0.UW_A_GMHf5h9-I0czjMb_Y96m1ODMNTy_nmqdSZk_DQ";
   
    }

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
  
  Disconect(){/*
    browser.cookies.remove('Connexion')*/
    let test:string|null = this.getCookie('username');
    console.log(test);
    this.deleteCookie('token');
    this.deleteCookie('username');
    
    //document.getElementById(connected).style.display = none;
  }
}

/*
if (browser.cookies.get('Connexion')!=null){
  //document.getElementById(connected).style.display = none;
  // console.log("test");
}
function Deconnexion(){
  
}*/