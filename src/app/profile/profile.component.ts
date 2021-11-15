import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  editMode: boolean = false;
  token = JSON.parse(localStorage.getItem('currentUser'))._token;
  profileInfo;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });

    this.route.queryParamMap.subscribe((res) => {
      const qParams = res.get('editMode');
      if (qParams != null) {
        this.editMode = true;
      } else {
        this.editMode = false;
      }
    });

    this._auth.profileInfo.subscribe((res) => {
      this.profileInfo = res;
      this.form.setValue({
        name: res.displayName,
        imageUrl: res.photoUrl,
      });
    });
  }

  onSubmit() {
    console.log(this.form.value);
    if (!this.form.valid) {
      return;
    } else {
      const uData = { token: this.token, ...this.form.value };
      this._auth.updateProfile(uData).subscribe(
        (data) => {
          console.log(data);
          this._auth.getProfileInfo(this.token);
          this.router.navigate(['/profile'], {
            queryParams: { editMode: null },
          });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onDiscard() {
    this.router.navigate([], { queryParams: { editMode: null } });
  }
}
