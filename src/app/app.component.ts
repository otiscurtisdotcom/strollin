import { Component, OnInit } from '@angular/core';

import { ALL_STARS } from './constants/constants';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Strollin';

  constructor(
    private readonly userService: UserService,
  ) {}

  ngOnInit() {
    const totalStarsLoaded = JSON.parse(localStorage.getItem(ALL_STARS) || "[]");
    this.userService.stars.next(totalStarsLoaded);
  }
}
