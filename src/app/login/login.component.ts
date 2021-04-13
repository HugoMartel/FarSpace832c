import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AccountService } from '../services/account/account.service';
import { MaterialModule } from '../material';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);

  hide:boolean = true;

  form!: FormGroup;

  onSubmit() {
    if (this.form.valid) {
      this.accountService.login(
        this.form.value.email,
        this.form.value.password
      );
    }

  }

  constructor(private accountService: AccountService, private formBuilder: FormBuilder){}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

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
