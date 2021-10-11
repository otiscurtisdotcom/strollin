import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ALL_STARS } from '../constants/constants';
import { LEVELS } from '../constants/levels';


const EMPTY_STARS: Stars[] = LEVELS.map(level => {
  return {
    levelNumber: level.id,
    levelStars: 0
  };
});

export interface Stars {
  levelNumber: number;
  levelStars: number
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly currentLevel = new BehaviorSubject(1);
  readonly stars = new BehaviorSubject<Stars[]>(EMPTY_STARS);

  readonly totalStars = this.stars.pipe(
    map(allLevels => {
      // Set local storage
      localStorage.setItem(ALL_STARS, JSON.stringify(allLevels));

      let totalStars = 0;
      allLevels.forEach(level => {
        totalStars += level.levelStars;
      })
      return totalStars;
    })
  );

  updateStars(liveScore: number) {
    combineLatest([
      this.currentLevel,
      this.stars
    ])
    .pipe(
      take(1),
      map(([currentLevel, stars]) => {
        const levelObject = LEVELS.find(level => level.id === currentLevel);
        const target = levelObject.three_star;
        const newLevelStars = liveScore >= target ? 3 :
                              liveScore >= target / 3 * 2 ? 2 :
                              liveScore >= target / 3 ? 1 :
                              0;
        const newStars = stars.map(level => {
          if (level.levelNumber === currentLevel
              && newLevelStars > level.levelStars) {
            level.levelStars = newLevelStars;
          }
          return level;
        });
        this.stars.next(newStars);
      })
    ).subscribe();
  }
}
