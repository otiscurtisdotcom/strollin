import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PixiService } from 'src/app/services/pixi.service';
import { ScoresService } from '../../services/scores.service';

@Component({
  selector: 'information',
  templateUrl: './information.component.html', 
  styleUrls: ['./information.component.scss']
})
export class InformationComponent {
  @Input() levelId: number;

  constructor(
    private readonly scoresService: ScoresService,
    private readonly router: Router,
    private readonly pixiService: PixiService
  ) {}

  readonly currentScore = this.scoresService.score;
  readonly wood = this.scoresService.wood;
  readonly movesLeft = this.scoresService.movesLeft;

  makeBench() {
    this.pixiService.makeBench();
  }

  restart() {
    this.pixiService.resetPositions();
    this.scoresService.restart();
    this.pixiService.setupGame(this.levelId);
  }

  exit() {
    this.pixiService.resetPositions();
    this.scoresService.restart();
    this.router.navigateByUrl('');
  }
}
