import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AccountService } from '../services/account/account.service';
import { MaterialModule } from '../material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  password2 = new FormControl('', [Validators.required, Validators.minLength(6)]);

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

  getPassword2ErrorMessage() {
    if (this.password2.hasError('required')) {
      return 'You must enter a value';
    }

    return this.password2.hasError('minlength') ? 'The password must be longer' : '';
  }

  register() {
    /*
    this.accountService
      .register(TODO)
      .subscribe((res) => {
        console.log(res);
      });
    */
  }

}
