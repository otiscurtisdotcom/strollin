import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUps, PopUpsType } from '../../constants/pop-ups';
import { ScoresService } from '../../services/scores.service';

@Component({
  selector: 'pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent {
  readonly score = this.scoresService.score;
  readonly stars = this.scoresService.stars;
  readonly popUpContent = this.scoresService.popUpType.pipe(
    map(popupType => {
      return PopUps.find(popup => popup.type === popupType);
    })
  );

  readonly popUpTypes = PopUpsType;

  constructor(
    private readonly scoresService: ScoresService
  ) {}

  restart() {
    this.scoresService.restart();
  }
}
