'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bullet = exports.Monster = undefined;

var _constants = require('./constants.js');

var _util = require('./util.js');

var _util2 = _interopRequireDefault(_util);

var _game = require('./game.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Monster(text) {
  var _this = this;

  this.s = text;
  this.dangerZone = [];

  this.getPlacement = function () {
    var randomStart = ~ ~(Math.random() * (_constants.WIDTH - _constants.RIGHTWALL - _constants.LEFTWALL));
    randomStart = Math.min(randomStart, _constants.WIDTH - _this.s.length);
    randomStart = Math.max(randomStart, 0);
    return randomStart;
  };

  this.createDangerZone = function () {
    for (var i = this.left; i < this.left + this.s.length; i++) {
      this.dangerZone.push(i);
    }
  };

  Object.assign(this, {
    type: 'mob',
    up: 0,
    left: this.getPlacement(),
    colour: 'red',
    dead: false,
    colourIndex: 0
  });

  this.createDangerZone();
  this.tick = function () {
    _this.up = _this.up + 1;
    if (_this.dead) {
      _this.turnToDebris();
    }
    if (_this.up > _constants.HEIGHT) {
      _this.remove();
    }
  };
  this.turnToDebris = function () {
    var str = '';
    for (var i = 0; i < _this.s.length; i++) {
      var debrisChoices = ';,.`\'"'.split('');
      str += _util2.default.getRandom(debrisChoices);
    }
    _this.s = str;
    var colourChoices = ['yellow', 'grey', 'black'];
    if (_this.colour !== 'black') {
      _this.colour = colourChoices[_this.colourIndex];
      _this.colourIndex++;
    } else {
      _this.remove();
    }
  };
  this.remove = function () {
    _game.gameState.splice(_game.gameState.indexOf(_this), 1);
  };
}

function Bullet(xCoord) {
  var _this2 = this;

  this.type = 'bullet';
  this.left = xCoord;
  this.s = '|';
  this.colour = 'magenta';
  this.up = _constants.PLAYERLINE - 1;
  this.speed = 2;
  this.tick = function () {
    _this2.up = _this2.up - 1;
    if (_this2.dead) {
      _this2.remove();
    }
  };
  this.dead = false;
  this.remove = function () {
    _game.gameState.splice(_game.gameState.indexOf(_this2), 1);
  };
}

exports.Monster = Monster;
exports.Bullet = Bullet;
//# sourceMappingURL=classes.js.map