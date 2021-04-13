import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router';

const headers = new HttpHeaders({'Content-Type':'application/json', 'Response-Type': 'application/json'});

interface Login {
  email: string;
  password: string;
}

interface Register {
  email: string;
  password: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private readonly http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  login(email: string, password: string): void {
    this.http.post<any>(window.location.origin + '/login', {
      email: email,
      password: password
    }, {headers}).subscribe((response) => {
      this.router.navigate(['/home']);
      if (response !== undefined && typeof response.message === "string") {
        this.snackBar.open(response.message, "close", {duration: 3000});
      }
    });
  }

  register(email: string, password: string, username: string): void {
    this.http.post<any>(window.location.origin + '/register', {
      email: email,
      password: password,
      username: username
    }, {headers}).subscribe((response) => {
      this.router.navigate(['/home']);
      if (response !== undefined && typeof response.message === "string") {
        this.snackBar.open(response.message, "close", {duration: 3000});
      }
    });
  }
}
