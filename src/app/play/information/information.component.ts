import { Component } from '@angular/core';
import { PixiService } from 'src/app/services/pixi.service';
import { ScoresService } from '../../services/scores.service';

@Component({
  selector: 'information',
  templateUrl: './information.component.html', 
  styleUrls: ['./information.component.scss']
})
export class InformationComponent {
  constructor(
    private readonly scoresService: ScoresService,
    private readonly pixiService: PixiService
  ) {}

  currentScore = this.scoresService.score;
  wood = this.scoresService.wood;
  movesLeft = this.scoresService.movesLeft;

  makeBench() {
    this.pixiService.makeBench();
  }
}
