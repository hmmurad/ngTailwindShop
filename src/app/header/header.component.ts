import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  profileInfo;
  constructor(private _auth: AuthService) {}

  ngOnInit(): void {
    this._auth.user.subscribe((res) => {
      this.isLoggedIn = !!res;
    });
  }

  onLogout() {
    this._auth.logout();
  }
}
