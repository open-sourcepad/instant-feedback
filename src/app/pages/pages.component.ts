import { Component } from '@angular/core';

@Component({
  selector: 'pages',
  templateUrl: './pages.pug',
  styleUrls: ['./pages.scss']
})
export class PagesComponent {
  title = 'app';

  showSidebar: boolean = false;

  constructor(
  ) {
  }
  
  toggleSidebar(){
    this.showSidebar = !this.showSidebar;
  }
}
