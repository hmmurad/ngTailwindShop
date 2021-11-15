import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorService } from './error.service';
import { User } from './user';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  apikey = environment.APIKEY;
  profileInfo = new BehaviorSubject({
    displayName: '',
    email: '',
    photoUrl: '',
  });
  constructor(
    private http: HttpClient,
    private _error: ErrorService,
    private router: Router
  ) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apikey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((err) => {
          return this._error.handleError(err);
        }),
        tap((res) => {
          this.userAuthentication(
            res.email,
            res.idToken,
            res.localId,
            +res.expiresIn
          );
        })
      );
  }
  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apikey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((err) => {
          return this._error.handleError(err);
        }),
        tap((res) => {
          this.userAuthentication(
            res.email,
            res.localId,
            res.idToken,
            +res.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    console.log(userData);

    if (!userData) {
      return;
    }
    const loggedUser = new User(
      userData.email,
      userData.userId,
      userData._token,
      new Date(userData._expirationDuration)
    );
    if (loggedUser.token) {
      this.user.next(loggedUser);
      const expirationDurationTimer =
        new Date(userData._expirationDuration).getTime() - new Date().getTime();
      this.autoLogOut(expirationDurationTimer);
      this.getProfileInfo(loggedUser.token);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogOut(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(
      () => this.logout(),
      expirationDuration
    );
  }

  private userAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogOut(expiresIn * 1000);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.getProfileInfo(token);
  }

  updateProfile(data) {
    return this.http
      .post<any>(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.apikey}`,
        {
          idToken: data.token,
          displayName: data.name,
          photoUrl: data.imageUrl,
          returnSecureToken: true,
        }
      )
      .pipe(catchError((err) => this._error.handleError(err)));
  }

  getProfileInfo(token) {
    this.http
      .post<any>(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.apikey}`,
        {
          idToken: token,
        }
      )
      .subscribe((res) => {
        this.profileInfo.next({
          displayName: res.users[0].displayName,
          email: res.users[0].email,
          photoUrl: res.users[0].photoUrl,
        });
      });
  }

  changePassword(data) {
    return this.http
      .post<any>(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.apikey}`,
        {
          idToken: data.idToken,
          password: data.password,
          returnSecureToken: true,
        }
      )
      .pipe(catchError((err) => this._error.handleError(err)));
  }
}
