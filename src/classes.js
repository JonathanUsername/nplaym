import { HEIGHT, WIDTH, LEFTWALL, RIGHTWALL, MIDWIDTH, MIDHEIGHT, FPS, FRAMERATE, DIFFICULTY, STARTTIME, PLAYERLINE } from './constants.js';
import util from './util.js';
import { gameState } from './game.js';

function Monster (text) {
  this.s = text;
  this.dangerZone = [];

  this.getPlacement = () => {
    let randomStart = ~~(Math.random() * (WIDTH - RIGHTWALL - LEFTWALL));
    randomStart = Math.min(randomStart, WIDTH - this.s.length);
    randomStart = Math.max(randomStart, 0);
    return randomStart;
  }

  this.createDangerZone = function () {
    for (var i = this.left; i < this.left + this.s.length; i++) {
      this.dangerZone.push(i);
    }
  }

  Object.assign(this, {
    type: 'mob',
    up: 0,
    left: this.getPlacement(),
    colour: 'red',
    dead: false,
    colourIndex: 0
  });

  this.createDangerZone();
  this.tick = () => {
    this.up = this.up + 1;
    if (this.dead) {
      this.turnToDebris();
    }
    if (this.up > HEIGHT) {
      this.remove();
    } 
  }
  this.turnToDebris = () => {
    let str = '';
    for (var i = 0; i < this.s.length; i++) {
      const debrisChoices = ';,.`\'"'.split('');
      str += util.getRandom(debrisChoices);
    }
    this.s = str;
    const colourChoices = ['yellow', 'grey', 'black'];
    if (this.colour !== 'black') {
      this.colour = colourChoices[this.colourIndex];
      this.colourIndex++;
    } else {
      this.remove();
    }
  }
  this.remove = () => {
    gameState.splice(gameState.indexOf(this), 1);
  }
}

function Bullet (xCoord) {
  this.type = 'bullet';
  this.left = xCoord;
  this.s = '|';
  this.colour = 'magenta';
  this.up = PLAYERLINE - 1;
  this.speed = 2;
  this.tick = () => {
    this.up = this.up - 1;
    if (this.dead) {
      this.remove();
    }
  }
  this.dead = false;
  this.remove = () => {
    gameState.splice(gameState.indexOf(this), 1);
  }
}

export { Monster, Bullet };