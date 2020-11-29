import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayComponent } from './play.component';
import { GameComponent } from './game.component'; 
import { InformationComponent } from './information/information.component';
import { PopUpComponent } from './pop-up/pop-up.component';

@NgModule({
  declarations: [
    GameComponent,
    InformationComponent,
    PlayComponent,
    PopUpComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PlayModule { }
