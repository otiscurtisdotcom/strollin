import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STARTING_MOVES = 20;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  //SCORES
  score = new BehaviorSubject(0);
  movesLeft = new BehaviorSubject(STARTING_MOVES);
  private liveScore = 0;
  private liveMovesLeft = STARTING_MOVES;

  //PLAYING
  isPlaying = new BehaviorSubject(false);

  makeMove() {
    this.liveScore += 1;
    this.score.next(this.liveScore);

    this.liveMovesLeft -= 1;
    this.movesLeft.next(this.liveMovesLeft);

    if (this.liveMovesLeft === 0) {
      this.gameOver();
    }
  }

  gameOver() {
    this.isPlaying.next(false);
  }

  restart() {
    
    this.isPlaying.next(true);
  }
}
