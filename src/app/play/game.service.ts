import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STARTING_MOVES = 20;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  //SCORES
  readonly score = new BehaviorSubject(0);
  readonly movesLeft = new BehaviorSubject(STARTING_MOVES);
  private liveScore = 0;
  private liveMovesLeft = STARTING_MOVES;

  //PLAYING
  readonly isPlaying = new BehaviorSubject(false);

  //MESSAGES
  readonly title = new BehaviorSubject("Welcome");
  readonly copy = new BehaviorSubject("Time for a stroll...");

  makeMove(endArea: boolean) {
    this.liveScore += 1;
    this.score.next(this.liveScore);

    this.liveMovesLeft -= 1;
    this.movesLeft.next(this.liveMovesLeft);

    if (endArea) {
      this.levelComplete();
    } else if (this.liveMovesLeft === 0) {
      this.gameOver();
    }
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
    this.liveScore = 0;
    this.liveMovesLeft = STARTING_MOVES;
    this.isPlaying.next(true);
  }
}
