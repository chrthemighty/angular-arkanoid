import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-ball',
  template: ``,
  styles: [``]
})
export class BallComponent implements OnInit {
  // ball position and size
  width = 45;
  height = 45;
  x = 880;
  y = 715;

  // ball speed
  velocity = 6;
  dx = 0;
  dy = 0;

  // ball status
  isReleased = false;

  // shared properties
  score = 0;
  canvas = this.data.canvas;

  // launch ball from player
  jump () {
    this.dy = -this.velocity;
    this.dx = -this.velocity;
    this.isReleased = true;
  }

  // ball moving on canvas
  move () {
    this.x += this.dx;
    this.y += this.dy;
  }

  stop () {
    this.dx = 0;
    this.dy = 0;
  }

  // checking collisions
  collide (e) {
    // re-assign position properties according to their future value
    const x = this.x + this.dx;
    const y = this.y + this.dy;

    if (x + this.width > e.x &&
      x < e.x + e.width &&
      y + this.height > e.y &&
      y < e.y + e.height) {
      return true;
    }
    return false;
  }

  // ball bumped brick, adding score, removing brick
  brickBump (e) {
    this.dy *= -1;
    e.isAlive = false;
    this.data.changeScore(this.score += 1);
    this.data.sounds.brickBump.play();
  }

  // ball bumped canvas border
  borderBump () {
    // re-assing position properties according to their future value
    const x = this.x + this.dx;
    const y = this.y + this.dy;

    // checking border side
    // left side
    if (x < 0) {
      this.x = 0;
      this.dx = this.velocity;
      this.data.sounds.borderBump.play();
      // right side
    } else if (x + this.width > this.canvas.width) {
      this.x = this.canvas.width - this.width;
      this.dx = -this.velocity;
      this.data.sounds.borderBump.play();
      // top side
    } else if (y < 0) {
      this.y = 0;
      this.dy = this.velocity;
      this.data.sounds.borderBump.play();
    }
  }

  // ball bumped player
  playerBump (player) {
    this.dy = -this.velocity;
    this.dx = this.onPlayerBumpSide(player) ? -this.velocity : this.velocity;
  }

  // checking the side of player when ball bumped it
  onPlayerBumpSide (player) {
    return (this.x + this.width / 2) < (player.x + player.width / 2);
  }

  ngOnInit () {
    // get and set shared properties from DataService
    this.data.currentScore.subscribe(score => this.score = score);
  }

  constructor(private data: DataService) {
  }
}
