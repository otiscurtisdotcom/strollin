import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'information',
  templateUrl: './information.component.html', 
  styleUrls: ['./information.component.scss']
})
export class InformationComponent {
  constructor(
    private readonly gameService: GameService
  ) {}

  currentScore = this.gameService.score;
  movesLeft = this.gameService.movesLeft;
}
