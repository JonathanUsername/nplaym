"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var HEIGHT = process.stdout.rows;
var WIDTH = process.stdout.columns;
var LEFTWALL = 10;
var RIGHTWALL = 10;
var MIDWIDTH = ~ ~(WIDTH / 2);
var MIDHEIGHT = ~ ~(HEIGHT / 2);
var FPS = 15;
var FRAMERATE = ~ ~(1000 / FPS);
var DIFFICULTY = 50; // out of 100
var STARTTIME = new Date().getTime();
var PLAYERLINE = ~ ~(HEIGHT / 4 + HEIGHT / 2);

exports.HEIGHT = HEIGHT;
exports.WIDTH = WIDTH;
exports.LEFTWALL = LEFTWALL;
exports.RIGHTWALL = RIGHTWALL;
exports.MIDWIDTH = MIDWIDTH;
exports.MIDHEIGHT = MIDHEIGHT;
exports.FPS = FPS;
exports.FRAMERATE = FRAMERATE;
exports.DIFFICULTY = DIFFICULTY;
exports.STARTTIME = STARTTIME;
exports.PLAYERLINE = PLAYERLINE;
//# sourceMappingURL=constants.js.map