import { Component, OnInit } from '@angular/core';

import { ALL_STARS } from './constants/constants';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private readonly userService: UserService,
  ) {}

  ngOnInit() {
    const starsLoaded = localStorage.getItem(ALL_STARS);
    if (starsLoaded) {
      const totalStarsLoaded = JSON.parse(starsLoaded);
      this.userService.stars.next(totalStarsLoaded);
    }
  }
}
