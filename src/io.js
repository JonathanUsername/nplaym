import { HEIGHT, WIDTH, LEFTWALL, RIGHTWALL, MIDWIDTH, MIDHEIGHT, FPS, FRAMERATE, DIFFICULTY, STARTTIME, PLAYERLINE } from './constants.js';
import keypress from 'keypress';
import pty from 'child_pty';
import { fire, player } from './game.js'
import argsparse from './parser.js'
import term from 'node-terminal';

const args = process.argv.slice(2);

argsparse.set(args);

let npmOutput = '';

const npm = pty.spawn('npm', args, {
  cwd: process.cwd()
})

const installingPackages = {};

function startListening () {
  npm.stdout.on('data', d => {
    npmOutput = d.toString();
    // We store it as keys in an object to uniq them
    const output = argsparse.parse(d);
    if (!output) {
      return;
    }
    const pkgs = output.split(' ');
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

  keypress(process.stdin);
  process.stdin.on('keypress', function (chunk, key) {
    if (!key) return; 
    if (key.ctrl && key.name == 'c') process.exit(1);
    switch (key.name) {
      case 'left':
        player.left = Math.max(player.left - 1, LEFTWALL);
      break;
      case 'right':
        player.left = Math.min(player.left + 1, WIDTH - RIGHTWALL);
      break;
      case 'space':
        fire();
      break;
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();
}


export { startListening, installingPackages, npmOutput }