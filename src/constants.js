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
  PLAYERLINE 
};