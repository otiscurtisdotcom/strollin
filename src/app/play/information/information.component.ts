import { Component } from '@angular/core';
import { ScoresService } from '../../services/scores.service';

@Component({
  selector: 'information',
  templateUrl: './information.component.html', 
  styleUrls: ['./information.component.scss']
})
export class InformationComponent {
  constructor(
    private readonly scoresService: ScoresService
  ) {}

  currentScore = this.scoresService.score;
  wood = this.scoresService.wood;
  movesLeft = this.scoresService.movesLeft;
}
