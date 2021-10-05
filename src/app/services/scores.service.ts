import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { STARTING_MOVES } from '../constants/constants';
import { LEVELS } from '../constants/levels';
import { PopUpsType } from '../constants/pop-ups';
import { Stars, UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ScoresService {
  //SCORES
  readonly score = new BehaviorSubject(0);
  readonly wood = new BehaviorSubject(0);
  readonly movesLeft = new BehaviorSubject(STARTING_MOVES);
  private liveScore = 0;
  private liveWood = 0;
  public liveMovesLeft = STARTING_MOVES;
  
  private liveStars: Stars[] = [
    {
      levelNumber: 1,
      levelStars: 0
    },
    {
      levelNumber: 2,
      levelStars: 0
    },
    {
      levelNumber: 3,
      levelStars: 0
    },
  ];
  
  //PLAYING
  readonly isPlaying = new BehaviorSubject(false);

  //POP UP
  readonly popUpType = new BehaviorSubject<PopUpsType>(PopUpsType.WELCOME);

  constructor(
    private readonly userService: UserService,
  ) {}

  makeMove(points: number, wood: number, endArea: boolean) {
    this.liveScore += points;
    this.score.next(this.liveScore);

    this.liveWood += wood;
    this.wood.next(this.liveWood);

    this.liveMovesLeft -= 1;
    this.movesLeft.next(this.liveMovesLeft);

    // Ignore if first move
    if (this.liveMovesLeft === STARTING_MOVES -1) return;

    if (endArea) {
      this.levelComplete();
    } else if (this.liveMovesLeft === 0) {
      this.gameOver();
    }
  }

  makeBench(bonusPoints: number) {
    this.liveWood -= 2;
    this.wood.next(this.liveWood);

    this.liveScore += bonusPoints;
    this.score.next(this.liveScore);

    this.liveMovesLeft = Math.min(STARTING_MOVES, this.liveMovesLeft + 12);
    this.movesLeft.next(this.liveMovesLeft);
  }

  gameOver() {
    this.popUpType.next(PopUpsType.GAME_OVER);
    this.isPlaying.next(false);
  }

  levelComplete() {
    this.updateLiveStars();
    this.popUpType.next(PopUpsType.LEVEL_COMPLETE);
    this.isPlaying.next(false);
  }

  start() {
    this.isPlaying.next(true);
  }

  end() {
    console.log('here');
    this.isPlaying.next(false);
  }

  restart() {
    this.score.next(0);
    this.movesLeft.next(STARTING_MOVES);
    this.wood.next(0);
    this.liveScore = 0;
    this.liveMovesLeft = STARTING_MOVES;
    this.liveWood = 0;
  }

  showWelcome() {
    console.log('Show welcome');
    this.popUpType.next(PopUpsType.WELCOME);
  }
  
  private updateLiveStars() {
    this.userService.currentLevel.pipe(
      map((currentLevel) => {
        const levelObject = LEVELS.find(level => level.id === currentLevel);
        const target = levelObject.three_star;
        const newLevelStars = this.liveScore >= target ? 3 :
                              this.liveScore >= target / 3 * 2 ? 2 :
                              this.liveScore >= target / 3 ? 1 :
                              0;
        this.liveStars.forEach(starsLevel => {
          if (starsLevel.levelNumber === currentLevel) {
            starsLevel.levelStars = newLevelStars;
          };
        });
        this.userService.updateStars(this.liveStars);
      })
    ).subscribe();
  }
}
