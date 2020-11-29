import { Component } from '@angular/core';
import { InformationService } from './information.service';

@Component({
  selector: 'information',
  templateUrl: './information.component.html', 
  styleUrls: ['./information.component.scss']
})
export class InformationComponent {
  constructor(
    private readonly informationService: InformationService
  ) {}

  currentScore = this.informationService.score;
}
