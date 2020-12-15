import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Stars {
  levelNumber: number;
  levelStars: number
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly currentLevel = new BehaviorSubject(1);
  readonly stars = new BehaviorSubject<Stars[]>([]);
  readonly totalStars = this.stars.pipe(
    map(allLevels => {
      let totalStars = 0;
      allLevels.forEach(level => {
        totalStars += level.levelStars;
      })
      return totalStars;
    })
  )

  updateStars(newStarsArray: Stars[]) {
    this.stars.next(newStarsArray);
  }
}
