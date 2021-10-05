import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IsLoadedGuard } from './guards/isLoadedGuard';
import { HasEnoughStarsGuard } from './guards/hasEnoughStarsGuard';
import { LevelsComponent } from './levels/levels.component';
import { PlayComponent } from './play/play.component';

const routes: Routes = [
  { path: '', component: LevelsComponent },
  { 
    path: 'play/:id',
    component: PlayComponent,
    canActivate: [IsLoadedGuard, HasEnoughStarsGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
