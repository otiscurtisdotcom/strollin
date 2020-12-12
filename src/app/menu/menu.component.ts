import { Component } from '@angular/core';
import { LEVELS } from '../constants/levels';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  levels = LEVELS;
}
