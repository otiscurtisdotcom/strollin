import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayModule } from './play/play.module';
import { LevelsComponent } from './levels/levels.component';

@NgModule({
  declarations: [
    AppComponent,
    LevelsComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    PlayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
