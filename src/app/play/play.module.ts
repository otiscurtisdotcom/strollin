import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayComponent } from './play.component';
import { GameComponent } from './game.component'; 
import { InformationComponent } from './information/information.component';

@NgModule({
  declarations: [
    GameComponent,
    InformationComponent,
    PlayComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PlayModule { }
