'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startSequence = exports.writeCentre = exports.cursorReturn = exports.paintScreen = undefined;

var _constants = require('./constants.js');

var _game = require('./game.js');

var _io = require('./io.js');

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _nodeTerminal = require('node-terminal');

var _nodeTerminal2 = _interopRequireDefault(_nodeTerminal);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function paintScreen() {

  for (var line = 0; line < _constants.HEIGHT; line++) {

    if (line === _constants.HEIGHT - 2) {
      var out = _io.npmOutput.replace(/\r?\n|\r/g, '');
      _nodeTerminal2.default.write(out);
      _nodeTerminal2.default.left(out.length);
    }

    if (line === 4) {
      (0, _game.setScore)();
      _nodeTerminal2.default.write(_game.SCORE);
      var scoreWidth = _game.SCORE.toString().length;
      _nodeTerminal2.default.left(scoreWidth);
    }

    paintMovers(line);

    _nodeTerminal2.default.nl();
  }

  _game.gameState.filter(function (item) {
    return item.type === 'bullet' || item.type === 'mob';
  }).forEach(function (item) {
    item.tick();
  });
}

function cursorReturn(item) {
  _nodeTerminal2.default.left(item.left + item.s.length);
}

function paintMovers(line) {
  var entities = _game.gameState.filter(function (item) {
    return item.up === line;
  }).sort(function (a, b) {
    return a.left > b.left;
  });

  if (entities.length > 0) {
    entities.forEach(function (item) {
      _nodeTerminal2.default.right(item.left).write(item.s[item.colour]);
      cursorReturn(item);
    });
    (0, _game.checkBullet)(line, entities);
    if (line === _constants.PLAYERLINE) {
      (0, _game.checkIntersects)(line, entities);
    }
  }
}

function writeCentre(msg, offset) {
  _nodeTerminal2.default.nl(_constants.MIDHEIGHT).write(msg).nl(_constants.MIDHEIGHT);
}

function startSequence() {
  // TODO: Sort out this callback cancer
  var deferred = _q2.default.defer();

  var _loop = function _loop(i) {
    setTimeout(function () {
      var str = ' '.repeat(i) + _game.player.s[_game.player.colour];
      _nodeTerminal2.default.write(str);
      _nodeTerminal2.default.left(str.length);
      if (i === _constants.MIDWIDTH) {
        var _loop2 = function _loop2(j) {
          setTimeout(function () {
            _nodeTerminal2.default.left(str.length);
            _nodeTerminal2.default.clearLine().nl().write(str);
            if (j === _constants.PLAYERLINE - 1) {
              var _loop3 = function _loop3(k) {
                setTimeout(function () {
                  _nodeTerminal2.default.nl();
                  if (k === _constants.HEIGHT - _constants.PLAYERLINE - 1) {
                    deferred.resolve();
                  }
                }, 20 * k);
              };

              for (var k = 0; k < _constants.HEIGHT - _constants.PLAYERLINE; k++) {
                _loop3(k);
              }
            }
          }, 20 * j);
        };

        for (var j = 0; j < _constants.PLAYERLINE; j++) {
          _loop2(j);
        }
      }
    }, 10 * i);
  };

  for (var i = 0; i < _constants.MIDWIDTH + 1; i++) {
    _loop(i);
  }
  return deferred.promise;
}

exports.paintScreen = paintScreen;
exports.cursorReturn = cursorReturn;
exports.writeCentre = writeCentre;
exports.startSequence = startSequence;
//# sourceMappingURL=display.js.map