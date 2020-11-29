import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent {
  readonly title = this.gameService.title;
  readonly copy = this.gameService.copy;

  constructor(
    private readonly gameService: GameService
  ) {}

  restart() {
    this.gameService.restart();
  }
}
