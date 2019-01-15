import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { RoutingState } from 'src/app/services/utils';

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
    private router: Router,
    private routingState: RoutingState
  ) { }

  ngOnInit() {
  }

  goBack() {
    var _returnUrl = this.routingState.getPreviousUrl();
    if(!_returnUrl){
      _returnUrl = this.returnUrl;
    }

    if(_returnUrl){
      this.router.navigateByUrl(_returnUrl);
    }else {
      this.location.back();
    }
  }

}
