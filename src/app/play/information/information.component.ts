import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LEVELS } from 'src/app/constants/levels';
import { PixiService } from 'src/app/services/pixi.service';
import { ScoresService } from '../../services/scores.service';

const BUFFER = 6;

@Component({
  selector: 'information',
  templateUrl: './information.component.html', 
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  @Input() levelId: number;
  
  readonly wood = this.scoresService.wood;
  readonly possibleBenches = this.wood.pipe(map(wood => Math.floor(wood / 2)));
  readonly movesLeft = this.scoresService.movesLeft;
  readonly currentScore = this.scoresService.score;
  maxScore: number;
  fillWidth: Observable<number>;
  numberOfStars: Observable<number>;
  
  constructor(
    private readonly scoresService: ScoresService,
    private readonly router: Router,
    private readonly pixiService: PixiService
  ) {}

  ngOnInit() {
    this.maxScore = LEVELS[this.levelId - 1].three_star;
    const barWidth = 
        document.querySelector('.bar').getClientRects()[0].width - (2 * BUFFER);

    this.fillWidth = this.scoresService.score.pipe(
        map(score => {
          const scorePercent = score / this.maxScore;
          const startWidth = BUFFER + scorePercent * barWidth;
          return scorePercent >= 1 ? startWidth + BUFFER : startWidth;
        }));

    this.numberOfStars = this.scoresService.score.pipe(
        map(score => Math.floor(score / this.maxScore * 3)));
  }

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
    this.scoresService.end();
    this.router.navigateByUrl('');
  }
}
