import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PixiService } from 'src/app/services/pixi.service';
import { UserService } from 'src/app/services/user.service';
import { PopUps, PopUpsType } from '../../constants/pop-ups';
import { ScoresService } from '../../services/scores.service';

@Component({
  selector: 'pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent {
  readonly score = this.scoresService.score;
  readonly currentLevel = this.userService.currentLevel;
  readonly stars = 
      combineLatest(this.userService.stars, this.currentLevel).pipe(
        map(([stars, currentLevel]) => {
          return stars.find(allLevels => allLevels.levelNumber === currentLevel)
        })
      );
  
  readonly popUpContent = this.scoresService.popUpType.pipe(
    map(popupType => {
      console.log('POP up type changed');
      return PopUps.find(popup => popup.type === popupType);
    })
  );

  readonly popUpTypes = PopUpsType;

  constructor(
    private readonly scoresService: ScoresService,
    private readonly router: Router,
    private readonly pixiService: PixiService,
    private readonly userService: UserService,
  ) {}

  start() {
    this.scoresService.start();
  }
  
  restart(level) {
    this.pixiService.resetPositions();
    this.scoresService.restart();
    this.pixiService.setupGame(level);
  }

  backToMenu() {
    this.pixiService.resetPositions();
    this.scoresService.restart();
    this.scoresService.end();
    this.router.navigateByUrl('');
  }
}
