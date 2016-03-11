'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _util = require('./util.js');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setting = void 0,
    args = void 0;

var Parser = {};

Parser.set = function (terms) {
  var strippedTerms = _lodash2.default.clone(terms);
  _lodash2.default.remove(strippedTerms, function (i) {
    return (/^-/.test(i)
    );
  });
  if (strippedTerms[0] === 'install' || strippedTerms[0] === 'i') {
    if (strippedTerms.length === 1) {
      setting = 'npmInstall';
    } else {
      setting = 'npmInstallSomething';
    }
  } else {
    setting = 'default';
  }
  args = strippedTerms;
};

Parser.parse = function (d) {
  switch (setting) {
    case 'npmInstall':
      var bits = d.toString().match(/:[a-zA-Z0-9\-_]+/);
      if (bits) {
        var packName = bits[0].slice(1);
        return packName;
      }
      return _util2.default.getRandom(args);
      break;
    case 'npmInstallSomething':
      return args;
      break;
    default:
      var justLetters = d.replace(/[^a-zA-Z0-9]+/g, '');
      var noColourCodes = justLetters.replace(/[\d]+m/, ' ');
      return noColourCodes;
      break;
  }
};

exports.default = Parser;
//# sourceMappingURL=parser.js.map