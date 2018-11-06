import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-player',
  template: ``,
  styles: ['']
})
export class PlayerComponent implements OnInit {
  // player position and size
  x = 770;
  y = 760;
  width = 260;
  height = 32;

  // player speed
  velocity = 10;
  dx = 0;

  // shared properties
  canvas = this.data.canvas;
  ball = {
    isOnPlayer: true
  };

  // move player if it is not outside the game
  move () {
    if (((this.x + this.dx) > 0) && ((this.x + this.dx) < this.canvas.width - this.width)) {
      this.x += this.dx;
    }
  }

  // stop player
  stop () {
    this.dx = 0;
  }

  constructor(private data: DataService) { }

  ngOnInit() {
  }

}
