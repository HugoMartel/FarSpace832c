import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const headers: HttpHeaders = new HttpHeaders().append(
  'Content-Type',
  'application/json'
);


interface Login {
  userEmail: string;
  userPassword: string;
}

interface Register {
  userEmail: string;
  userPassword: string;
  userName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private readonly http: HttpClient) {}

  login(userEmail: string, userPassword: string): Observable<any> {
    return this.http.post<Login>('/home', {
      title: 'Angular POST Login Request',
      headers: headers,
      params: new HttpParams()
        .append('userEmail', userEmail)
        .append('userPassword', userPassword),
    });
  }

  register(
    userEmail: string,
    userPassword: string,
    userName: string
  ): Observable<any> {
    return this.http.post<Register>('/home', {
      title: 'Angular POST Register Request',
      headers: headers,
      params: new HttpParams()
        .append('userEmail', userEmail)
        .append('userPassword', userPassword)
        .append('userName', userName),
    });
  }
}
