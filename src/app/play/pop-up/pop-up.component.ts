import { Component } from '@angular/core';
import { ScoresService } from '../../services/scores.service';

@Component({
  selector: 'pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent {
  readonly title = this.scoresService.title;
  readonly copy = this.scoresService.copy;

  constructor(
    private readonly scoresService: ScoresService
  ) {}

  restart() {
    this.scoresService.restart();
  }
}
