import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  constructor() {}
  ngOnInit() {
    const cssRule = 'color: #FD2BBC;' +
      'font-size: 40px;' +
      'text-align: center' +
      'font-weight: bold;' +
      'text-shadow: 1px 1px 5px rgb(249, 162, 34);' +
      'filter: dropshadow(color=#3c8308, offx=1, offy=1);';
    setTimeout(console.info.bind(console, '%cPastyphotos.com', cssRule), 0);
  }
}
