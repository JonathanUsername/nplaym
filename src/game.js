import { HEIGHT, WIDTH, LEFTWALL, RIGHTWALL, MIDWIDTH, MIDHEIGHT, FPS, FRAMERATE, DIFFICULTY, STARTTIME, PLAYERLINE } from './constants.js';
import term from './terminal.js';
import { Monster, Bullet } from './classes.js';
import { writeCentre, paintScreen, startSequence } from './display.js';
import { installingPackages } from './io.js';

let SCORE = 0; 
let ALIVE = true;
let LOOP;

const gameState = [{
  type: 'player',
  s: '^',
  up: PLAYERLINE,
  left: MIDWIDTH,
  colour: 'blue'
}];

const player = gameState[0];

function checkBullet(entities) {
  const bullets = entities.filter(i => i.type === 'bullet');
  const mobs = entities.filter(i => i.type === 'mob');
  const bulletsToGo = [];
  bullets.forEach((bullet, bi) => {
    // console.log(item.left, dangerZone)
    mobs.forEach((mob, mi) => {
      if (intersects(bullet.left, mob.dangerZone) && !bullet.dead && !mob.dead) {
        bullet.dead = true;
        bullet.colour = 'black';
        mob.s = 'x'.repeat(mob.s.length);
        mob.dead = true;
        mob.colour = 'yellow';
        addScore(mob.s.length);
      }
    })
  })
} 

function checkIntersects (entities) {
  const playerPos = entities.find(item => item.type === 'player').left;
  const mobs = entities.filter(i => i.type === 'mob');
  mobs.forEach(mob => {
    if (intersects(playerPos, mob.dangerZone) && !mob.dead) {
      ALIVE = false;
      setTimeout(gameOver, 1000)
    }
  });
}

function gameOver (win) {
  if (win) {
    writeCentre(`You win! Packages installed! Your score was ${SCORE}.`);
  } else {
    writeCentre(`You lose! Give up, go home, and sell your keyboard on ebay.\nNo packages have been installed but then I'm sure you've got used to failure by now.\n\nYour score was ${SCORE}.`);
  }
  process.exit(0);
}

function intersects (pos, dangerZone) {
  if (dangerZone.indexOf(pos) !== -1 ) {
    return true;
  }
  return false;
}

function generateMobs () {
  const packages = Object.keys(installingPackages);
  if (packages.length > 0 && (Math.random() * 100) < DIFFICULTY) {
    const lastMsg = packages.pop();
    gameState.push(new Monster(lastMsg));
  }
}

function addScore (int) {
  SCORE = SCORE + int;
}

function startGame () {
  startSequence(function () {
    LOOP = interval(runLoop, FRAMERATE);
  })
}

function fire () {
  gameState.push(new Bullet(player.left));
}

function interval(func, wait, times){
    var interv = function(w, t){
        return function(){
            if(typeof t === "undefined" || t-- > 0){
                setTimeout(interv, w);
                try{
                    func.call(null);
                }
                catch(e){
                    t = 0;
                    throw e.toString();
                }
            }
        };
    }(wait, times);

    setTimeout(interv, wait);
};

function runLoop () {
  if (ALIVE) {
    // term.clear();
    generateMobs();
    paintScreen();
  }
};

export { gameState, checkIntersects, checkBullet, SCORE, addScore, startGame, fire, player, gameOver };