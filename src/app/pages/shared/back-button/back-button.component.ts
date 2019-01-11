import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'back-button',
  templateUrl: './back-button.component.pug',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnInit {

  @Input() backText;
  @Input() returnUrl;

  constructor(
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
  }

  goBack() {
    if(this.returnUrl){
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.location.back();
    }
  }

}
