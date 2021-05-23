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
      if (response !== undefined) {
        if (typeof response.message === "string") {
          this.router.navigate(['/home']);
          this.snackBar.open(response.message, "close", {duration: 3000});
        }else if (typeof response.fail === "string") {
            this.snackBar.open(response.fail, "close", {duration: 3000});
        } else if (response.error !== undefined) {
          console.error(response.error);
          this.snackBar.open("An error occurred during your login...", "close", {duration: 3000});
        }
      }
    });
  }

  register(email: string, password: string, username: string): void {
    this.http.post<any>(window.location.origin + '/register', {
      email: email,
      password: password,
      username: username
    }, {headers}).subscribe((response) => {
      if (response !== undefined) {
        if (typeof response.message === "string") {
          this.router.navigate(['/home']);
          this.snackBar.open(response.message, "close", {duration: 3000});
        } else if (response.error !== undefined) {
          console.error(response.error);
          this.snackBar.open("An error occurred during your register...", "close", {duration: 3000});
        }
      }
    });
  }
}
