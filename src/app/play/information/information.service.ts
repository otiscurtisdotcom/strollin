import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STARTING_MOVES = 20;

@Injectable({
  providedIn: 'root'
})
export class InformationService {
  startingMoves = STARTING_MOVES;

  score = new BehaviorSubject(0);
  movesLeft = new BehaviorSubject(STARTING_MOVES);
}
