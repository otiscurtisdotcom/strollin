import { Component } from '@angular/core';
import { ScoresService } from '../services/scores.service';

@Component({
  selector: 'play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent {
  readonly isPlaying = this.scoresService.isPlaying;

  constructor(
    private readonly scoresService: ScoresService
  ) {}
}
