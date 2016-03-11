'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.npmOutput = exports.installingPackages = exports.startListening = undefined;

var _constants = require('./constants.js');

var _keypress = require('keypress');

var _keypress2 = _interopRequireDefault(_keypress);

var _child_pty = require('child_pty');

var _child_pty2 = _interopRequireDefault(_child_pty);

var _game = require('./game.js');

var _parser = require('./parser.js');

var _parser2 = _interopRequireDefault(_parser);

var _nodeTerminal = require('node-terminal');

var _nodeTerminal2 = _interopRequireDefault(_nodeTerminal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = process.argv.slice(2);

_parser2.default.set(args);

var npmOutput = '';

var npm = _child_pty2.default.spawn('npm', args, {
  cwd: process.cwd()
});

var installingPackages = {};

function startListening() {
  npm.stdout.on('data', function (d) {
    exports.npmOutput = npmOutput = d.toString();
    // We store it as keys in an object to uniq them
    var output = _parser2.default.parse(d);
    if (!output) {
      return;
    }
    var pkgs = output.split(' ');
    pkgs.forEach(function (pkg) {
      installingPackages[pkg] = 1;
    });
  });

  npm.stdout.on('end', function (d) {
    gameOver(true);
  });

  npm.on('close', function (d) {
    gameOver(true);
  });

  (0, _keypress2.default)(process.stdin);
  process.stdin.on('keypress', function (chunk, key) {
    if (!key) return;
    if (key.ctrl && key.name == 'c') process.exit(1);
    switch (key.name) {
      case 'left':
        _game.player.left = Math.max(_game.player.left - 1, _constants.LEFTWALL);
        break;
      case 'right':
        _game.player.left = Math.min(_game.player.left + 1, _constants.WIDTH - _constants.RIGHTWALL);
        break;
      case 'space':
        (0, _game.fire)();
        break;
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();
}

exports.startListening = startListening;
exports.installingPackages = installingPackages;
exports.npmOutput = npmOutput;
//# sourceMappingURL=io.js.map