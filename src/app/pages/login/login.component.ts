import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormBuilder,
  FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  redirectUrl: string = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private sessionApi: SessionService,
    private router: Router,
    private appSetting: AppSettings,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    let sub = this.route.queryParams.subscribe(params => {
      if(params['redirectUrl']) this.redirectUrl = params['redirectUrl'];
    });
    sub.unsubscribe();
  }

  onSubmit(values) {
    this.loading = true;
    this.sessionApi.login({resource: values})
      .subscribe(
        res => {
          this.sessionApi.setSession(res['data']);
          this.appSetting.set({loggedIn: true, isManager: res['data']['is_manager']});
          this.router.navigateByUrl(this.redirectUrl);
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
