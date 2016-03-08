#!/usr/local/bin/node

'use strict'

const term = require('node-terminal');
const keypress = require('keypress');
const colors = require('colors');
const pty = require('pty.js');
const args = process.argv.slice(2);

const HEIGHT = process.stdout.rows;
const WIDTH = process.stdout.columns;
const LEFTWALL = 10;
const RIGHTWALL = 10;
const MIDWIDTH = ~~(WIDTH / 2);
const MIDHEIGHT = ~~(HEIGHT / 2);
const FPS = 15;
const FRAMERATE = ~~(1000 / FPS);
const DIFFICULTY = 50; // out of 100
const STARTTIME = new Date().getTime();
const PLAYERLINE = ~~(HEIGHT / 4 + HEIGHT / 2);
let ALIVE = true;

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

npm.on('close', d => {
  gameOver(true);
});

let SCORE = 0;

term.clear();

const gameState = [{
  type: 'player',
  s: '^',
  up: PLAYERLINE,
  left: MIDWIDTH,
  colour: 'blue'
}];

function Monster (text) {
  this.s = text;

  this.getPlacement = () => {
    let randomStart = ~~(Math.random() * (WIDTH - RIGHTWALL - LEFTWALL));
    randomStart = Math.min(randomStart, WIDTH - this.s.length);
    randomStart = Math.max(randomStart, 0);
    return randomStart;
  }

  Object.assign(this, {
    type: 'mob',
    up: 0,
    left: this.getPlacement(),
    colour: 'red'
  });
}

function isInstall (args) {
  return args[0] === 'i' || args[0] === 'install';
}

function paintScreen () {
  for (let line = 0; line < HEIGHT; line++) {

    if (line === 4) {
      setScore();
      term.write(SCORE);
      const scoreWidth = SCORE.toString().length;
      term.left(scoreWidth);
    }

    paintMovers(line)

    term.nl();
  }

  gameState.filter(item => item.type === 'mob')
    .forEach(item => {
      item.up++;
    })
}

function cursorReturn (item) {
  term.left(item.left + item.s.length)
}

function paintMovers (line) {
  const entities = gameState.filter(item => item.up === line).sort((a, b) => a.left > b.left);


  if (entities.length > 0) {
    entities.forEach(item => {
      term.right(item.left).write(item.s[item.colour]);
      cursorReturn(item)
    })
    if (line === PLAYERLINE) {
      checkIntersects(line, entities)
    }
  }
}

function checkIntersects (line, entities) {
  const playerPos = entities.find(item => item.type === 'player').left;
  const dangerZone = [];
  entities.filter(item => item.type === 'mob')
    .forEach(item => {
      for (var i = item.left; i < item.left + item.s.length; i++) {
        dangerZone.push(i);
      }
    });
  if (intersects(playerPos, dangerZone)) {
    ALIVE = false;
    setTimeout(gameOver, 1000)
  }
}

function gameOver (win) {
  if (win) {
    writeCentre(`You win! Packages installed! Your score was ${SCORE}.`);
  } else {
    writeCentre(`You lose! Give up, go home, and sell your keyboard on ebay.\nNo packages have been installed but then I'm sure you've got used to failure by now.\n\nYour score was ${SCORE}.`);
  }
  process.exit();
}

function writeCentre (msg, offset) {
  term.nl(MIDHEIGHT).write(msg).nl(MIDHEIGHT);
}

function intersects (playerPos, dangerZone) {
  if (dangerZone.indexOf(playerPos) !== -1 ) {
    return true;
  }
  return false;
}

function generateScene () {
  const packages = Object.keys(installingPackages);
  if (packages.length > 0 && (Math.random() * 100) < DIFFICULTY) {
    const lastMsg = packages.pop();
    gameState.push(new Monster(lastMsg));
  }
}

function setScore () {
  SCORE = new Date().getTime() - STARTTIME;
}

function runLoop () {
  if (ALIVE) {
    term.clear();
    generateScene();
    paintScreen();
  }
};

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

setInterval(runLoop, FRAMERATE);