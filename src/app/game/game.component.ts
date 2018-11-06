import { Component, ViewChild, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { BallComponent } from './ball/ball.component';
import { PlayerComponent } from './player/player.component';
import { DataService } from './data.service';

@Component({
  selector: 'app-game',
  template: `
    <canvas #canvas width=1800 height=820></canvas>
    `,
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  // initializing canvas(game) element
  @ViewChild('canvas') canvas: ElementRef;
  ctx: CanvasRenderingContext2D;

  // game area settings
  width = this.data.canvas.width;
  height = this.data.canvas.height;
  rows = 5;
  cols = 10;
  running = true;
  restarting = false;

  // game sprites
  sprites = {
    brick: undefined,
    ball: undefined,
    player: undefined,
    scoreTable: undefined
  };

  // game items
  ball = new BallComponent(this.data);
  player = new PlayerComponent(this.data);
  bricks = [];
  score = 0;

  ngOnInit () {
    // initializing canvas settings
    this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.ctx.font = 'bold 40px Chakra Petch';
    this.ctx.fillStyle = '#fff';
    this.start();

    // get and set shared properties from DataService
    this.data.currentScore.subscribe(score => this.score = score);

    // moving platform on pressing arrows
    this.renderer.listen('document', 'keydown', (e) => {
      if (e.keyCode === 37) {
        this.player.dx = -this.player.velocity;
        // check if ball is on player
        if (this.player.ball.isOnPlayer) {
          this.ball.dx = this.player.dx;
        }
      } else if (e.keyCode === 39) {
        this.player.dx = this.player.velocity;
        if (this.player.ball.isOnPlayer) {
          this.ball.dx = this.player.dx;
        }
      }
    });

    // stop moving platform when arrow is not pressed
    this.renderer.listen('document', 'keyup', () => {
      this.player.stop();
      if (this.player.ball.isOnPlayer) {
        this.ball.stop();
      }
    });

    // launch ball when space is pressed
    this.renderer.listen('document', 'keydown', (e) => {
      // launch the ball when game is running and ball is on player
      if (e.keyCode === 32 && this.running && this.player.ball.isOnPlayer) {
        this.ball.jump();
        
        // ball is not on player anymore
        this.player.ball.isOnPlayer = false;
        this.data.sounds.gameStart.play();
      }
    });

    // restart game when R is pressed
    this.renderer.listen('document', 'keydown', (e) => {
      if (e.keyCode === 82 && this.running === false) {
        this.restart();
      }
    });
  }

  // sprites loading
  load () {
    for (const sprite in this.sprites) {
      if (sprite) {
        this.sprites[sprite] = new Image();
        this.sprites[sprite].src = '../../assets/images/' + sprite + '.png';
      }
    }
  }

  // create bricks
  create () {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.bricks.push({
          x: 173 * col + 40,
          y: 50 * row + 30,
          width: 163,
          height: 40,
          isAlive: true
        });
      }
    }
  }

  // start game
  start () {
    this.load();
    this.create();
    this.run();
  }

  // sprites rendering
  render () {
    // removing previous rendering
    this.ctx.clearRect(0, 0, this.width, this.height);

    // render scoretable
    this.ctx.drawImage(this.sprites.scoreTable, -5, this.height - 125);
    this.ctx.fillText('SCORE: ' + this.score, 20, this.height - 75);

    // render player
    this.ctx.drawImage(this.sprites.player, this.player.x, this.player.y);

    // bricks rendering according to its 'isAlive' property
    this.bricks.forEach(function (e) {
      if (e.isAlive) {
        this.ctx.drawImage(this.sprites.brick, e.x, e.y);
      }
    }, this);

    // render ball
    this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);

    // render how to start game when ball is on player
    if (this.player.ball.isOnPlayer) {
      this.ctx.fillText('Press SPACE to start', this.width / 2 - 180, this.height / 2);
    }
  }

  // detect changes
  update () {
    // checking if player bumped all bricks
    if (this.score >= this.bricks.length) {
      this.over('You win!');
      this.ball.stop();
    }

    // checking if ball is out of the bottom border
    if (this.ball.y >= this.height + this.ball.height) {
      this.over('Game over');
      // preventing infinity sound play
      this.ball.y -= 10;
      this.ball.dy = 0;
    }

    // move ball if it has speed
    if (this.ball.dx || this.ball.dy) {
      this.ball.move();
    }

    // checking if ball collide with any brick
    this.bricks.forEach((el) => {
      // only if it's alive
      if (el.isAlive) {
        if (this.ball.collide(el)) {
          this.ball.brickBump(el);
        }
      }
    });

    // checking if ball collide with any border side
    this.ball.borderBump();

    // move player if it has speed
    if (this.player.dx) {
      this.player.move();
    }

    // checking ball collision with player
    if (this.ball.collide(this.player)) {
      this.ball.playerBump(this.player);
    }

  }

  restart () {
    // setting intial game settings
    this.score = 0;
    this.restarting = true;
    this.run();

    // setting inital values for ball
    this.ball.x = 880;
    this.ball.y = 715;
    this.ball.dx = 0;
    this.ball.dy = 0;

    // setting initial values for player
    this.player.x = 770;
    this.player.ball.isOnPlayer = true;

    // re-creating bricks
    this.bricks = [];
    this.load();
    this.create();
  }

  // run game
  run () {
    // run game if it's running or restarting
    if (this.running || this.restarting) {
      this.running = true;
      this.update();
      this.load();
      this.render();
      // loop running
      requestAnimationFrame (() => {
        this.run();
      });
    }

    // if game was run on restarting, setting value to false because it was restarted
    this.restarting = false;
  }

  // end of the game
  over (message) {
    if (message === 'Game over') {
      this.data.sounds.gameOver.play();
    } else if (message === 'You win!') {
      this.data.sounds.youWin.play();
    }

    // timeout to render text before game stops running
    setTimeout (() => {
      this.ctx.font = 'bold 40px Chakra Petch';
      this.ctx.fillText('Press R to restart', this.width / 2 - 160, this.height / 2);
    }, 100);

    // stop the game
    this.running = false;
  }

  constructor(private data: DataService, private renderer: Renderer2) {
  }
}
