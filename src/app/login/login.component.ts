import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AccountService } from '../services/account/account.service';
import { MaterialModule } from '../material';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);

  hide = true;

  onSubmit() {
    console.log("U CLICKED XDDDDDDDDDDD");
  }

  constructor(private accountService: AccountService){}

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }

    return this.password.hasError('minlength') ? 'The password must be longer' : '';
  }

  login() {
    /*
    this.accountService
      .login(TODO)
      .subscribe((res) => {
        console.log(res);
      });
    */
  }

}
