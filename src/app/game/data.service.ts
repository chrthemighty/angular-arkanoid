import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // game sounds
  sounds = {
    backgroundMusic: new Howl({
      src: ['../assets/sounds/backgroundMusic.mp3'],
      autoplay: true,
      loop: true,
      volume: 0.025
    }),
    gameStart: new Howl({
      src: ['../assets/sounds/gameStart.ogg']
    }),
    brickBump: new Howl({
      src: ['../assets/sounds/brickBump.wav']
    }),
    playerBump: new Howl({
      src: ['../assets/sounds/playerBump.wav']
    }),
    borderBump: new Howl({
      src: ['../assets/sounds/playerBump.wav']
    }),
    gameOver: new Howl({
      src: ['../assets/sounds/gameOver.wav']
    }),
    youWin: new Howl({
      src: ['../assets/sounds/youWin.wav']
    })
  };

  //  game score
  private score = new BehaviorSubject(0);
  currentScore = this.score.asObservable();

  // game canvas
  canvas = {
    width: 1800,
    height: 880
  };

  constructor() { }

  changeScore(score: number) {
    this.score.next(score);
  }
}
