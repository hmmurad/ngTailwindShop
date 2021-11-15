import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ErrorService } from '../auth/error.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  success: boolean = false;
  errMsgs = this._error.errMsgs;
  error;
  token = JSON.parse(localStorage.getItem('currentUser'))._token;
  constructor(
    private fb: FormBuilder,
    private _auth: AuthService,
    private _error: ErrorService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      changePassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const data = { idToken: this.token, ...this.form.value };
      console.log(data);
      this._auth.changePassword(data).subscribe(
        (res) => {
          console.log(res);
          this.success = true;
        },
        (err) => {
          console.log(err);
          this.error = this.errMsgs[err];
        }
      );
    } else {
      return;
    }
  }
}
