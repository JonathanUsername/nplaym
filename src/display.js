import { HEIGHT, WIDTH, LEFTWALL, RIGHTWALL, MIDWIDTH, MIDHEIGHT, FPS, FRAMERATE, DIFFICULTY, STARTTIME, PLAYERLINE } from './constants.js';
import { SCORE, setScore, checkIntersects, checkBullet, gameState, player } from './game.js';
import { npmOutput } from './io.js';
import colors from 'colors';
import term from 'node-terminal';
import Q from 'q';

function paintScreen () {

  for (let line = 0; line < HEIGHT; line++) {

    if (line === HEIGHT - 2) {
      const out = npmOutput.replace(/\r?\n|\r/g, '');
      term.write(out);
      term.left(out.length)
    }

    if (line === 4) {
      setScore();
      term.write(SCORE);
      const scoreWidth = SCORE.toString().length;
      term.left(scoreWidth);
    }

    paintMovers(line)

    term.nl();
  }

  gameState.filter(item => item.type === 'bullet' || item.type === 'mob')
    .forEach(item => {
      item.tick();
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
    checkBullet(line, entities);
    if (line === PLAYERLINE) {
      checkIntersects(line, entities)
    }
  }
}

function writeCentre (msg, offset) {
  term.nl(MIDHEIGHT).write(msg).nl(MIDHEIGHT);
}

function startSequence () {
  // TODO: Sort out this callback cancer
  const deferred = Q.defer();
  for (let i = 0; i < MIDWIDTH + 1; i++) {
    setTimeout(function () {
      const str = ' '.repeat(i) + player.s[player.colour];
      term.write(str);
      term.left(str.length)
      if (i === MIDWIDTH) {
        for (let j = 0; j < PLAYERLINE; j++) {
          setTimeout(function () {
            term.left(str.length)
            term.clearLine().nl().write(str)
            if (j === PLAYERLINE - 1) {
              for (let k = 0; k < HEIGHT - PLAYERLINE; k++) {
                setTimeout(function () { 
                  term.nl();
                  if (k === HEIGHT - PLAYERLINE - 1) {
                    deferred.resolve();
                  }
                }, 20 * k)
              }
            }
          }, 20 * j)
        }
      }
    }, 10 * i)
  }
  return deferred.promise;
}


export { paintScreen, cursorReturn, writeCentre, startSequence };