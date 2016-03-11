"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var utils = {
  getRandom: function getRandom(arr) {
    return arr[~ ~(Math.random() * arr.length)];
  }
};

exports.default = utils;
//# sourceMappingURL=util.js.map