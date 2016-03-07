'use strict'

const term = require('node-terminal');
const keypress = require('keypress');
const colors = require('colors');

const HEIGHT = process.stdout.rows;
const WIDTH = process.stdout.columns;
const MIDWIDTH = ~~(WIDTH / 2);
const MIDHEIGHT = ~~(HEIGHT / 2);
const FPS = 60;
const FRAMERATE = ~~(1000 / FPS);
const DIFFICULTY = 0.5; // Lower is harder
const STARTTIME = new Date().getTime();

let SCORE = 0;

term.clear();

const gameState = [{
  type: 'player',
  s: '^'.blue,
  up: ~~(HEIGHT / 4 + HEIGHT / 2),
  left: MIDWIDTH
}];

function paintScreen () {
  for (let i = 0; i < HEIGHT; i++) {

    const arr = gameState
      .filter(item => item.up === i);

    if (arr.length > 0) {
      arr.forEach(item => {
        term.right(item.left).write(item.s).left(item.left);
        item.tick ? item.tick() : false;
      })
      if (intersect(arr)) {
        writeCentre(`BOOM. Game over. Your score was ${SCORE}`);
        process.exit();
      }
    }
    if (i === 4) {
      setScore();
      term.left(0).write(SCORE);
    }
    term.write('').nl();
  }
}

function writeCentre (msg, offset) {
  term.nl(MIDHEIGHT).clear().up(MIDHEIGHT).right(MIDWIDTH - msg.length).write(msg).nl(MIDHEIGHT);
}

function intersect (arr) {
  const player = arr.find(item => item.type === 'player');
  const enemyPositions = arr.filter(i => i.type === 'mob').map(i => i.left);
  if (player && enemyPositions.indexOf(player.left) !== -1 ) {
    return true;
  }
  return false;
}

function generateScene () {
  if (Math.random() > DIFFICULTY) {
    gameState.push(new Monster);
  }
}

function setScore () {
  SCORE = new Date().getTime() - STARTTIME;
}

function Monster () {
  Object.assign(this, {
    type: 'mob',
    s: 'X'.red,
    up: 0,
    left: ~~(Math.random() * WIDTH)
  });

  setInterval(() => {
    this.up++;
  }, FRAMERATE);
}

setInterval(function(){
  generateScene();
  paintScreen();
}, FRAMERATE);

keypress(process.stdin);
process.stdin.on('keypress', function (chunk, key) {
  if (!key) return; 
  if (key.ctrl && key.name == 'c') process.exit();
  switch (key.name) {
    case 'left':
      gameState.find(i => i.type === 'player').left--;
    break;
    case 'right':
      gameState.find(i => i.type === 'player').left++;
    break;
  }
});
process.stdin.setRawMode(true); 
process.stdin.resume();