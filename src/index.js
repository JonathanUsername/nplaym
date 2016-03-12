'use strict';

import { startGame } from './game.js';
import { startListening } from './io.js';
import { execSync } from 'child_process';

const npmVersion = parseInt(execSync('npm --version').toString());
if (npmVersion < 3) {
  console.log('This game only works properly with NPM 3, please consider upgrading!')
}

startListening();
startGame();
