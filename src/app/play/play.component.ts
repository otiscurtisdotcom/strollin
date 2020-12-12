import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ScoresService } from '../services/scores.service';

@Component({
  selector: 'play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  readonly isPlaying = this.scoresService.isPlaying;
  levelId: Observable<string>;

  constructor(
    private readonly scoresService: ScoresService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.levelId = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id'))
    );
  }
}
