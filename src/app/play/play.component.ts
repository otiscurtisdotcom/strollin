import { Component } from '@angular/core';
import { GameService } from './game.service';

@Component({
  selector: 'play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent {
  readonly isPlaying = this.gameService.isPlaying;

  constructor(
    private readonly gameService: GameService
  ) {}
  
  resetPosition() {
    console.log('test');
  }
}
