import { HEIGHT, WIDTH, LEFTWALL, RIGHTWALL, MIDWIDTH, MIDHEIGHT, FPS, FRAMERATE, DIFFICULTY, STARTTIME, PLAYERLINE } from './constants.js';
import { SCORE, setScore, checkIntersects, checkBullet, gameState, player } from './game.js';
import { npmOutput } from './io.js';
import colors from 'colors';
import term from 'node-terminal';
import Q from 'q';

function paintScreen() {

  for (var line = 0; line < HEIGHT; line++) {

    if (line === 1) {
      var out = npmOutput.replace(/\r?\n|\r/g, '');
      term.write(out);
      term.left(out.length);
    }

    if (line === 4) {
      setScore();
      term.write(SCORE);
      var scoreWidth = SCORE.toString().length;
      term.left(scoreWidth);
    }

    paintMovers(line);

    term.nl();
  }

  gameState.filter(function (item) {
    return item.type === 'bullet' || item.type === 'mob';
  }).forEach(function (item) {
    item.tick();
  });
}

function cursorReturn(item) {
  term.left(item.left + item.s.length);
}

function paintMovers(line) {
  var entities = gameState.filter(function (item) {
    return item.up === line;
  }).sort(function (a, b) {
    return a.left > b.left;
  });

  if (entities.length > 0) {
    entities.forEach(function (item) {
      term.right(item.left).write(item.s[item.colour]);
      cursorReturn(item);
    });
    checkBullet(line, entities);
    if (line === PLAYERLINE) {
      checkIntersects(line, entities);
    }
  }
}

function writeCentre(msg, offset) {
  term.nl(MIDHEIGHT).write(msg).nl(MIDHEIGHT);
}

function startSequence() {
  // TODO: Sort out this callback cancer
  var deferred = Q.defer();

  var _loop = function _loop(i) {
    setTimeout(function () {
      var str = ' '.repeat(i) + player.s[player.colour];
      term.write(str);
      term.left(str.length);
      if (i === MIDWIDTH) {
        var _loop2 = function _loop2(j) {
          setTimeout(function () {
            term.left(str.length);
            term.clearLine().nl().write(str);
            if (j === PLAYERLINE - 1) {
              var _loop3 = function _loop3(k) {
                setTimeout(function () {
                  term.nl();
                  if (k === HEIGHT - PLAYERLINE - 1) {
                    deferred.resolve();
                  }
                }, 20 * k);
              };

              for (var k = 0; k < HEIGHT - PLAYERLINE; k++) {
                _loop3(k);
              }
            }
          }, 20 * j);
        };

        for (var j = 0; j < PLAYERLINE; j++) {
          _loop2(j);
        }
      }
    }, 10 * i);
  };

  for (var i = 0; i < MIDWIDTH + 1; i++) {
    _loop(i);
  }
  return deferred.promise;
}

export { paintScreen, cursorReturn, writeCentre, startSequence };
//# sourceMappingURL=display.js.map