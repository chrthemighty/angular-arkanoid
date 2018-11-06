import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { BallComponent } from './game/ball/ball.component';
import { PlayerComponent } from './game/player/player.component';

@NgModule({
  imports:       [ BrowserModule ],
  declarations: [ AppComponent, GameComponent, BallComponent, PlayerComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {}
