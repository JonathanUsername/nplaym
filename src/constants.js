const HEIGHT = process.stdout.rows;
const WIDTH = process.stdout.columns;
const LEFTWALL = 10;
const RIGHTWALL = 10;
const MIDWIDTH = ~~(WIDTH / 2);
const MIDHEIGHT = ~~(HEIGHT / 2);
const FPS = 15;
const FRAMERATE = ~~(1000 / FPS);
const DIFFICULTY = 50; // out of 100
const STARTTIME = new Date().getTime();
const PLAYERLINE = ~~(HEIGHT / 4 + HEIGHT / 2);
const LOSEMSGS = [
  'You lose! Give up, go home, and sell your keyboard on ebay.\nNo packages have been installed. Because life is hard.',
  'You have failed in your mission. The packages have won.\nWhat will become of us now?',
  'Game over.\nNo packages were harmed or installed in the playing of this game.',
  'You failed to wrangle the packages into their node_modules/ corral.\nBetter luck next time, cowboy.',
  'Your ship crashed into an errant piece of installation debris and now you\'ll have to start all over again.\nThis is probably quite embarassing for you.',
  'Uh oh. Looks like you failed to install any packages.\nHave you tried just mashing the spacebar?'
];

export { HEIGHT,
  WIDTH,
  LEFTWALL,
  RIGHTWALL,
  MIDWIDTH,
  MIDHEIGHT,
  FPS,
  FRAMERATE,
  DIFFICULTY,
  STARTTIME,
  PLAYERLINE,
  LOSEMSGS
};