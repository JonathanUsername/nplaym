'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.player = exports.fire = exports.startGame = exports.setScore = exports.SCORE = exports.checkBullet = exports.checkIntersects = exports.gameState = undefined;

var _constants = require('./constants.js');

var _nodeTerminal = require('node-terminal');

var _nodeTerminal2 = _interopRequireDefault(_nodeTerminal);

var _classes = require('./classes.js');

var _display = require('./display.js');

var _io = require('./io.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SCORE = 0;
var ALIVE = true;
var LOOP = void 0;

var gameState = [{
  type: 'player',
  s: '^',
  up: _constants.PLAYERLINE,
  left: _constants.MIDWIDTH,
  colour: 'blue'
}];

var player = gameState[0];

function checkBullet(line, entities) {
  var bullets = entities.filter(function (i) {
    return i.type === 'bullet';
  });
  var mobs = entities.filter(function (i) {
    return i.type === 'mob';
  });
  var bulletsToGo = [];
  bullets.forEach(function (bullet, bi) {
    // console.log(item.left, dangerZone)
    mobs.forEach(function (mob, mi) {
      if (intersects(bullet.left, mob.dangerZone) && !bullet.dead && !mob.dead) {
        bullet.dead = true;
        bullet.colour = 'black';
        mob.s = 'x'.repeat(mob.s.length);
        mob.dead = true;
        mob.colour = 'yellow';
      }
    });
  });
}

function checkIntersects(line, entities) {
  var playerPos = entities.find(function (item) {
    return item.type === 'player';
  }).left;
  var mobs = entities.filter(function (i) {
    return i.type === 'mob';
  });
  var dangerZone = [];
  mobs.forEach(function (mob) {
    if (intersects(playerPos, mob.dangerZone) && !mob.dead) {
      ALIVE = false;
      setTimeout(gameOver, 1000);
    }
  });
}

function gameOver(win) {
  if (win) {
    (0, _display.writeCentre)('You win! Packages installed! Your score was ' + SCORE + '.');
  } else {
    (0, _display.writeCentre)('You lose! Give up, go home, and sell your keyboard on ebay.\nNo packages have been installed but then I\'m sure you\'ve got used to failure by now.\n\nYour score was ' + SCORE + '.');
  }
  process.exit(0);
}

function intersects(pos, dangerZone) {
  if (dangerZone.indexOf(pos) !== -1) {
    return true;
  }
  return false;
}

function generateScene() {
  var packages = Object.keys(_io.installingPackages);
  if (packages.length > 0 && Math.random() * 100 < _constants.DIFFICULTY) {
    var lastMsg = packages.pop();
    gameState.push(new _classes.Monster(lastMsg));
  }
}

function setScore() {
  exports.SCORE = SCORE = new Date().getTime() - _constants.STARTTIME;
}

function startGame() {
  (0, _display.startSequence)().then(function () {
    LOOP = setInterval(runLoop, _constants.FRAMERATE);
  });
}

function fire() {
  gameState.push(new _classes.Bullet(player.left));
}

function runLoop() {
  if (ALIVE) {
    // term.clear();
    generateScene();
    (0, _display.paintScreen)();
  }
};

exports.gameState = gameState;
exports.checkIntersects = checkIntersects;
exports.checkBullet = checkBullet;
exports.SCORE = SCORE;
exports.setScore = setScore;
exports.startGame = startGame;
exports.fire = fire;
exports.player = player;
//# sourceMappingURL=game.js.map