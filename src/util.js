
const utils = {
  getRandom: function (arr) {
    return arr[~~(Math.random() * arr.length)];
  }
};

export default utils;