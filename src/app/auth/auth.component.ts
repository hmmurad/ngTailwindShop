import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponse, AuthService } from './auth.service';
import { ErrorService } from './error.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  error = '';
  errMsg = this._error.errMsgs;
  form: FormGroup;
  loginMood: boolean = true;

  constructor(
    private fb: FormBuilder,
    private _auth: AuthService,
    private _error: ErrorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this._auth.user.subscribe((user) => {
      if (user) {
        this.router.navigate(['/']);
      }
    });
  }

  onSwitch() {
    this.loginMood = !this.loginMood;
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const email = this.form.value.email;
    const password = this.form.value.password;
    let authObs: Observable<AuthResponse>;
    if (this.loginMood) {
      authObs = this._auth.login(email, password);
    } else {
      authObs = this._auth.signup(email, password);
    }

    authObs.subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/']);
      },
      (err) => {
        console.log(err);
        this.error = this.errMsg[err];
      }
    );
  }

  private initForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
}
