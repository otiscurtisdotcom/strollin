import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ScoresService } from '../services/scores.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  readonly isPlaying = this.scoresService.isPlaying;
  levelId: Observable<number>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly scoresService: ScoresService,
    private readonly userService: UserService,
  ) {}

  ngOnInit() {
    this.levelId = this.route.paramMap.pipe(
      map((params: ParamMap) => {
        const levelNumber = parseInt(params.get('id'));
        this.userService.currentLevel.next(levelNumber);
        return levelNumber;
      })
    );
  }
}
