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
  movesLeft = this.scoresService.movesLeft;
}
