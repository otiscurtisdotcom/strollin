import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { STARTING_MOVES } from './constants';

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

  //PLAYING
  readonly isPlaying = new BehaviorSubject(false);

  //MESSAGES
  readonly title = new BehaviorSubject("Welcome");
  readonly copy = new BehaviorSubject("Time for a stroll...");

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

  makeBench() {
    this.liveWood -= 2;
    this.wood.next(this.liveWood);

    this.liveMovesLeft += 12;
    this.movesLeft.next(this.liveMovesLeft);
  }

  gameOver() {
    this.title.next(`GAME OVER`);
    this.copy.next(`Better luck next time`);
    this.isPlaying.next(false);
  }

  levelComplete() {
    this.title.next(`LEVEL COMPLETE`);
    this.copy.next(`Final score: ${this.liveScore}`);
    this.isPlaying.next(false);
  }

  restart() {
    this.score.next(0);
    this.movesLeft.next(STARTING_MOVES);
    this.wood.next(0);
    this.liveScore = 0;
    this.liveMovesLeft = STARTING_MOVES;
    this.liveWood = 0;
    this.isPlaying.next(true);
  }
}
