import { Component } from '@angular/core';

import { LEVELS } from '../constants/levels';
import { PixiService } from '../services/pixi.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  readonly levels = LEVELS;
  readonly totalStars = this.userService.totalStars;

  constructor(
    private readonly pixiService: PixiService,
    private readonly userService: UserService,
  ) {
    this.pixiService.loadBasics();
  }
}
