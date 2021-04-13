import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AccountService } from '../services/account/account.service';
import { MaterialModule } from '../material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  //! XSS attacks are handled by {{}} append operator from Angular, make sure to use them
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  password2 = new FormControl('', [Validators.required, Validators.minLength(6)]);
  username = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);

  hide:boolean = true;
  hide2:boolean = true;

  form!: FormGroup;

  constructor(private accountService: AccountService, private formBuilder: FormBuilder){}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      password2: [null, [Validators.required, Validators.minLength(6)]],
      username: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.form.value.password === this.form.value.password2)
        this.accountService.register(
          this.form.value.email,
          this.form.value.password, 
          this.form.value.username
        );
    }
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

    if (!(/\d/.test(this.password.value)) || !(/[A-Z]/.test(this.password.value)) || !(/[a-z]/.test(this.password.value)) ) {
      return 'Your password must contain at least a number, a lowercase letter and an uppercase letter'
    }

    if (this.password !== this.password2) {
      return 'You must enter the same password twice';
    }

    return this.password.hasError('minlength') ? 'The password must be longer' : '';
  }

  getPassword2ErrorMessage() {
    if (this.password2.hasError('required')) {
      return 'You must enter a value';
    }

    if (!(/\d/.test(this.password.value)) || !(/[A-Z]/.test(this.password.value)) || !(/[a-z]/.test(this.password.value)) ) {
      return 'Your password must contain at least a number, a lowercase letter and an uppercase letter'
    }

    if (this.password !== this.password2) {
      return 'You must enter the same password twice';
    }

    return this.password2.hasError('minlength') ? 'The password must be longer' : '';
  }

  getUsernameErrorMessage() {
    if (this.username.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.username.hasError('maxlength')) {
      return 'The username must be shorter';
    }

    return this.username.hasError('minlength') ? 'The username must be longer' : '';
  }

}
