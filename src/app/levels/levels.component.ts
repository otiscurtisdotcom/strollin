import { Component } from '@angular/core';

import { LEVELS } from '../constants/levels';
import { PixiService } from '../services/pixi.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss']
})
export class LevelsComponent {
  readonly levels = LEVELS;
  readonly totalStars = this.userService.totalStars;

  constructor(
    private readonly pixiService: PixiService,
    private readonly userService: UserService,
  ) {
    this.pixiService.loadBasics();
  }
}
