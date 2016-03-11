import _ from 'lodash';
import util from './util.js';

var setting = void 0,
    args = void 0;

var Parser = {};

Parser.set = function (terms) {
  var strippedTerms = _.clone(terms);
  _.remove(strippedTerms, function (i) {
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
      return util.getRandom(args);
      break;
    case 'npmInstallSomething':
      return args;
      break;
    default:
      var justLetters = d.toString().replace(/[^a-zA-Z0-9]+/g, '');
      var noColourCodes = justLetters.replace(/[\d]+m/, ' ');
      return noColourCodes;
      break;
  }
};

export default Parser;
//# sourceMappingURL=parser.js.map