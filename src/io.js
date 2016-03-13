import { HEIGHT, WIDTH, LEFTWALL, RIGHTWALL, MIDWIDTH, MIDHEIGHT, FPS, FRAMERATE, DIFFICULTY, STARTTIME, PLAYERLINE } from './constants.js';
import keypress from 'keypress';
import pty from 'child_pty';
import { fire, player, gameOver } from './game.js'
import argsparse from './parser.js'
import term from './terminal.js';

const args = process.argv.slice(2);

argsparse.set(args);

let npmOutput = '';

const npm = pty.spawn('npm', args, {
  cwd: process.cwd()
})

const installingPackages = {};

function startListening () {
  npm.stdout.on('data', d => {
    var str = d.toString();
    if (str.length > 5) {
      npmOutput = str;
    }
    // We store it as keys in an object to quickly uniq them
    const output = argsparse.parse(d);
    if (!output) {
      return;
    }
    let pkgs;
    if (typeof output === 'string') {
      pkgs = output.split(' ');
    } else {
      pkgs = output;
    }
    pkgs.forEach(pkg => {
      installingPackages[pkg] = 1;
    })
  });

  npm.stdout.on('end', d => {
    gameOver(true);
  });

  npm.on('close', d => {
    gameOver(true);
  });

  process.on('exit', function () {
    npm.kill('SIGINT');
    term.showCursor();
  });

  process.stdin.setRawMode(true);

  term.hideCursor();

  keypress(process.stdin);

  process.stdin.on('keypress', function (chunk, key) {
    if (!key) return; 
    if (key.ctrl && key.name == 'c') {
      process.exit(1);
    }
    switch (key.name) {
      case 'left':
        term.right(1);
        player.left = Math.max(player.left - 1, LEFTWALL);
      break;
      case 'right':
        term.left(1);
        player.left = Math.min(player.left + 1, WIDTH - RIGHTWALL);
      break;
      case 'space':
        term.left(1);
        fire();
      break;
    }
  });

}


export { startListening, installingPackages, npmOutput }