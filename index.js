#!/usr/local/bin/node

'use strict'

const term = require('node-terminal');
const keypress = require('keypress');
const colors = require('colors');
const pty = require('pty.js');
const args = process.argv.slice(2);

console.log('begin')

var npm = pty.spawn('npm', args, {
  cwd: process.cwd()
})

const installingPackages = {};

npm.stdout.on('data', d => {
  // New npm
  const bits = d.toString().match(/:[a-zA-Z0-9\-_]+/)
  if (bits) {
    const packName = bits[0].slice(1);
    installingPackages[packName] = 1;
  }
});

npm.stdout.on('end', d => {
  gameOver(true);
});


const HEIGHT = process.stdout.rows;
const WIDTH = process.stdout.columns;
const LEFTWALL = 10;
const RIGHTWALL = 10;
const MIDWIDTH = ~~(WIDTH / 2);
const MIDHEIGHT = ~~(HEIGHT / 2);
const FPS = 30;
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

function isInstall (args) {
  return args[0] === 'i' || args[0] === 'install';
}

function paintScreen () {
  for (let line = 0; line < HEIGHT; line++) {

    if (line === 4) {
      setScore();
      term.clearLine().left(0).write(SCORE);
    } else {
      paintMovers(line);
    }

    term.nl().clearLine();
  }
}

function paintMovers (line) {
  const arr = gameState.filter(item => item.up === line);

  if (arr.length > 0) {
    arr.forEach(item => {
      term.right(item.left).write(item.s).left(item.left);
    })
    const dangerZone = [];
    arr.forEach(item => {
      for (var i = item.left; i < item.left + item.s.length; i++) {
        dangerZone.push(i);
      }
    })
    if (playerHitMobIn(dangerZone)) {
      gameOver();
    }
  }
}

function gameOver (win) {
  if (win) {
    writeCentre(`You win! Packages installed! Your score was ${SCORE}.`);
  } else {
    writeCentre(`You lose! Go home and sell your keyboard on ebay. You suck.\nNo packages have been installed but then I'm sure you've got used to failure by now.\n\nYour score was ${SCORE}.`);
  }
  process.exit();
}

function writeCentre (msg, offset) {
  term.nl(MIDHEIGHT).clear().up(MIDHEIGHT).right(MIDWIDTH - msg.length).write(msg).nl(MIDHEIGHT);
}

function playerHitMobIn (arr) {
  const player = arr.find(item => item.type === 'player');
  const enemyPositions = arr.filter(i => i.type === 'mob').map(i => i.left);
  if (player && enemyPositions.indexOf(player.left) !== -1 ) {
    return true;
  }
  return false;
}

function generateScene () {
  const packages = Object.keys(installingPackages);
  if (packages.length > 0) {
    const lastMsg = packages.pop();
    gameState.push(new Monster(lastMsg));
  }
}

function setScore () {
  SCORE = new Date().getTime() - STARTTIME;
}

function Monster (text) {
  Object.assign(this, {
    type: 'mob',
    s: text.red,
    up: 0,
    left: Math.max(Math.min(~~(Math.random() * WIDTH - text.length), WIDTH - RIGHTWALL), LEFTWALL)
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
  const player = gameState.find(i => i.type === 'player');
  switch (key.name) {
    case 'left':
      player.left = Math.max(player.left - 1, LEFTWALL);
    break;
    case 'right':
      player.left = Math.min(player.left + 1, WIDTH - RIGHTWALL);
    break;
  }
});
process.stdin.setRawMode(true); 
process.stdin.resume();
