# NPlayM
A silly wrapper for npm. Play a Space-Invaders-like game while you're installing your node_modules!

Try to survive the onslaught of installing packages, destroy as many as you can before they install. If you lose, no packages are installed, muahahaha!

This is a terminal-based game, so you can even play it over SSH. It works by spawning NPM in a pseudo-TTY, then regexing that stdout and then abusing ANSI codes to spray it all across your terminal. Because it takes any arguments it should work as a drop-in replacement for NPM, ie. you can do anything with it that you can do with NPM, `npm help`, `npm i --save foo bar` or `npm run whatever`, it will keep running until its child NPM process ends. However, I haven't tested anything but `install`, so if it ends up killing babies or summoning a demonic presence, please don't blame me.

I created this as a bit of fun after discussing with a colleague about slow NPM installs. One of the key ideas was to point out just how many packages you are installing by turning them all into enemies you have to blast or avoid. You might not realise how many packages you're relying on.

![screen shot 2016-03-10 at 11 35 44](https://fat.gfycat.com/ThornyDownrightCowrie.gif)

## How to install 

```
npm install -g nplaym
```

## How to run

Either clone a project with a package.json and run `nplaym install` to install its dependencies, or:

```
mkdir myProject     # Create a new directory with no node_modules/ yet.
cd myProject 
nplaym install babel react redux eslint istanbul lodash nodemon mongoose commander chai # Install lots of big dependencies
```

## How to play
Left and right to steer your craft, space to fire.

Tested with Node v4.2.2

TODO:
- Support older versions of npm, not just >3
