import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormBuilder,
  FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../services/api';
import { AppSettings } from '../../services/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.pug',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading: boolean = false;
  hasError: boolean = false;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private sessionApi: SessionService,
    private router: Router,
    private appSetting: AppSettings
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(values) {
    this.loading = true;
    this.sessionApi.login({resource: values})
      .subscribe(
        res => {
          this.sessionApi.setSession(res['data']);
          this.appSetting.set({loggedIn: true, isManager: res['data']['is_manager']});
          this.router.navigateByUrl('/dashboard');
          this.loading = false;
        },
        err => {
          this.errorMsg = err.error.error;
          this.hasError = true;
          this.loading = false;
        }
      );
  }
}
